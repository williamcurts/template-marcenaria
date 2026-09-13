"""Conceptual exploded study from a fused surface mesh, not fabrication geometry.

Run in background with assets/blender/chair-original.blend as input.
Original scene/data is retained; all cuts use independent mesh copies.
"""
import bpy
import bmesh
import json
import math
from pathlib import Path
from mathutils import Vector

ROOT = Path(r'D:\DEV\Refinatto Marcenaria')
OUT = ROOT / 'assets' / 'blender'
source = bpy.data.objects['geometry_0']
scene = bpy.data.scenes.new('Refinatto | Chair exploded study')
bpy.context.window.scene = scene
scene['purpose'] = 'Conceptual surface segmentation. Not a manufacturing assembly.'
scene.render.fps = 30
scene.frame_start = 1
scene.frame_end = 330
scene.render.engine = 'CYCLES'
scene.cycles.samples = 32
scene.cycles.use_denoising = True
scene.render.resolution_x = 1400
scene.render.resolution_y = 1400
scene.render.resolution_percentage = 100
scene.world = bpy.data.worlds.new('Obsidian studio')
scene.world.use_nodes = True
scene.world.node_tree.nodes['Background'].inputs[0].default_value = (.025,.025,.023,1)
scene.world.node_tree.nodes['Background'].inputs[1].default_value = .35

cap = bpy.data.materials.new('Conceptual cut | walnut interior')
cap.use_nodes = True
shader = cap.node_tree.nodes.get('Principled BSDF')
shader.inputs['Base Color'].default_value = (.095,.047,.024,1)
shader.inputs['Roughness'].default_value = .62

collection = bpy.data.collections.new('CHAIR | five conceptual groups')
scene.collection.children.link(collection)

def cut(bm, point, normal, keep_positive):
    result = bmesh.ops.bisect_plane(
        bm, geom=list(bm.verts)+list(bm.edges)+list(bm.faces),
        dist=0.000001, plane_co=point, plane_no=normal,
        clear_inner=keep_positive, clear_outer=not keep_positive)
    boundary = [e for e in result['geom_cut'] if isinstance(e,bmesh.types.BMEdge) and e.is_boundary]
    if boundary:
        filled = bmesh.ops.holes_fill(bm, edges=boundary, sides=0)
        for face in filled['faces']:
            face.material_index = len(source.data.materials)
            face.smooth = False

def make_part(name, planes, delta, start, end):
    mesh = source.data.copy()
    mesh.name = name + 'Mesh'
    mesh.materials.append(cap)
    bm = bmesh.new()
    bm.from_mesh(mesh)
    # Imported UV splits must be welded before capping; loop UVs remain intact.
    bmesh.ops.remove_doubles(bm, verts=list(bm.verts), dist=.000001)
    for point,normal,positive in planes:
        cut(bm,point,normal,positive)
    bmesh.ops.recalc_face_normals(bm, faces=list(bm.faces))
    bm.to_mesh(mesh)
    bm.free()
    mesh.update()
    obj = bpy.data.objects.new(name,mesh)
    collection.objects.link(obj)
    obj['segmentation'] = 'Conceptual cut from fused source surface'
    obj['exploded_offset'] = delta
    obj['source_object'] = source.name
    for frame,progress in [(1,0),(start,0),(end,1),(220,1),(300,0),(330,0)]:
        obj.location = Vector(delta)*progress
        obj.keyframe_insert(data_path='location', frame=frame, group='ExplodedView')
    if obj.animation_data and obj.animation_data.action:
        obj.animation_data.action.name = name + '|ExplodedView'
        for layer in obj.animation_data.action.layers:
            for strip in layer.strips:
                for bag in strip.channelbags:
                    for curve in bag.fcurves:
                        for key in curve.keyframe_points:
                            key.interpolation = 'BEZIER'
                            key.handle_left_type = 'AUTO_CLAMPED'
                            key.handle_right_type = 'AUTO_CLAMPED'
    return obj

up = (0,0,1)
leg_plane = (0,0,-.145)
parts = []
parts.append(make_part('chairBody',[(leg_plane,up,True)],(0,.02,.20),40,125))
for name,x,y in [('frontLeftLeg',-1,-1),('frontRightLeg',1,-1),('rearLeftLeg',-1,1),('rearRightLeg',1,1)]:
    parts.append(make_part(name,[(leg_plane,up,False),((0,0,0),(1,0,0),x>0),((0,0,0),(0,1,0),y>0)],(x*.105,y*.08,-.13),85,165))

camera_data = bpy.data.cameras.new('Product camera | 65 mm')
camera = bpy.data.objects.new('Product camera | 65 mm',camera_data)
scene.collection.objects.link(camera)
camera.location = (1.65,-2.8,1.2)
camera.rotation_euler = (Vector((0,0,.08))-camera.location).to_track_quat('-Z','Y').to_euler()
camera_data.lens = 65
scene.camera = camera

for name,location,power,size,color in [
    ('Key | warm silk',(1.6,-2.2,3),220,2.5,(1,.83,.66)),
    ('Fill | soft',(-2,-.8,1.2),90,2.8,(.82,.88,1)),
    ('Rim | walnut',(0,2,2.5),240,1.6,(1,.80,.61)),
]:
    data = bpy.data.lights.new(name,'AREA')
    data.energy = power
    data.shape = 'DISK'
    data.size = size
    data.color = color
    obj = bpy.data.objects.new(name,data)
    scene.collection.objects.link(obj)
    obj.location = location
    obj.rotation_euler = (Vector((0,0,.1))-obj.location).to_track_quat('-Z','Y').to_euler()

for name,frame in [('MONTADA',1),('ABERTURA',40),('EXPLODIDA',165),('PAUSA',220),('RECOMPOSICAO',300)]:
    scene.timeline_markers.new(name,frame=frame)

for area in bpy.context.screen.areas:
    if area.type in {'CONSOLE','VIEW_3D'}:
        area.type = 'VIEW_3D'
        area.spaces.active.region_3d.view_perspective = 'CAMERA'
        area.spaces.active.shading.type = 'MATERIAL'

scene.frame_set(1)
bpy.ops.object.select_all(action='DESELECT')
for obj in parts:
    obj.select_set(True)
bpy.context.view_layer.objects.active = parts[0]

export_args = dict(filepath=str(ROOT/'public/models/refinatto-chair.glb'),export_format='GLB',use_selection=True,use_active_scene=True,export_animations=True,export_animation_mode='SCENE',export_anim_scene_split_object=False,export_nla_strips_merged_animation_name='ExplodedView',export_frame_range=True,export_force_sampling=True,export_cameras=False,export_lights=False,export_extras=True)
bpy.ops.export_scene.gltf(**export_args)

manifest = {'source':'chair-original.blend','scope':'Conceptual exploded study; source has one fused surface, no internal joinery. Upper upholstered body remains a combined assembly.', 'frames':{'assembled':1,'start':40,'exploded':165,'holdUntil':220,'reassembled':300,'end':330},'fps':30,'parts':[{'name':o.name,'vertices':len(o.data.vertices),'faces':len(o.data.polygons),'offset':list(o['exploded_offset'])} for o in parts]}
(OUT/'chair-exploded-manifest.json').write_text(json.dumps(manifest,indent=2))
scene.frame_set(185)
bpy.ops.wm.save_as_mainfile(filepath=str(OUT/'refinatto-chair-exploded.blend'))
for name,frame in [('assembled',1),('exploded',185)]:
    scene.frame_set(frame)
    scene.render.filepath = str(OUT/f'chair-{name}.png')
    bpy.ops.render.render(write_still=True)
print('EXPORTED CHAIR:',json.dumps(manifest))
