import bpy
from pathlib import Path
from mathutils import Vector

OUT = Path(r'D:\DEV\Refinatto Marcenaria\assets\blender')
source = bpy.data.objects['geometry_0']
scene = bpy.data.scenes.new('Chair review')
bpy.context.window.scene = scene
chair = bpy.data.objects.new('Chair review',source.data.copy())
scene.collection.objects.link(chair)
scene.render.engine = 'CYCLES'
scene.cycles.samples = 16
scene.cycles.use_denoising = True
scene.render.resolution_x = 800
scene.render.resolution_y = 800
scene.render.resolution_percentage = 100
scene.world = bpy.data.worlds.new('Review world')
scene.world.use_nodes = True
scene.world.node_tree.nodes['Background'].inputs[0].default_value = (0.06,0.06,0.055,1)
scene.world.node_tree.nodes['Background'].inputs[1].default_value = .4
camera_data = bpy.data.cameras.new('Review camera')
camera = bpy.data.objects.new('Review camera',camera_data)
scene.collection.objects.link(camera)
scene.camera = camera
camera_data.type = 'ORTHO'
camera_data.ortho_scale = 1.5
for name, location, power, size in [('Key',(2,-3,4),300,3),('Fill',(-2,-1,2),180,3),('Rim',(0,3,3),250,2)]:
    light = bpy.data.lights.new(name, 'AREA')
    light.energy = power
    light.shape = 'DISK'
    light.size = size
    obj = bpy.data.objects.new(name,light)
    scene.collection.objects.link(obj)
    obj.location = location
    obj.rotation_euler = (-obj.location).to_track_quat('-Z','Y').to_euler()
for name, location in [('side',(3,0,0)),('straight',(0,-3,0)),('top',(0,0,3))]:
    camera.location = location
    camera.rotation_euler = (-camera.location).to_track_quat('-Z','Y').to_euler()
    scene.render.filepath = str(OUT/f'chair-review-{name}.png')
    bpy.ops.render.render(write_still=True)
