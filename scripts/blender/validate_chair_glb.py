"""Validate the exported artifact without changing the open Blender scene."""
import json
import struct
from pathlib import Path

root = Path(r'D:\DEV\Refinatto Marcenaria')
data = (root/'public/models/refinatto-chair.glb').read_bytes()
magic, version, length = struct.unpack_from('<III',data)
assert magic == 0x46546C67 and version == 2 and length == len(data)
json_length, json_type = struct.unpack_from('<II',data,12)
assert json_type == 0x4E4F534A
doc = json.loads(data[20:20+json_length])
bin_offset = 20+json_length+8
expected = {'chairBody','frontLeftLeg','frontRightLeg','rearLeftLeg','rearRightLeg'}
mesh_nodes = {n['name'] for n in doc['nodes'] if 'mesh' in n}
assert mesh_nodes == expected, mesh_nodes
assert len(doc['scenes']) == 1
assert len(doc.get('animations',[])) == 1
assert doc.get('images') and all('bufferView' in img for img in doc['images'])

def read_accessor(index):
    accessor = doc['accessors'][index]
    view = doc['bufferViews'][accessor['bufferView']]
    assert accessor['componentType'] == 5126
    count = {'SCALAR':1,'VEC3':3,'VEC4':4}[accessor['type']]
    offset = bin_offset + view.get('byteOffset',0)+accessor.get('byteOffset',0)
    stride = view.get('byteStride',4*count)
    return [struct.unpack_from('<'+'f'*count,data,offset+i*stride) for i in range(accessor['count'])]

animation = doc['animations'][0]
animated = set()
for channel in animation['channels']:
    if channel['target']['path'] != 'translation':
        continue
    name = doc['nodes'][channel['target']['node']]['name']
    sampler = animation['samplers'][channel['sampler']]
    times = read_accessor(sampler['input'])
    positions = read_accessor(sampler['output'])
    assert all(abs(a-b)<1e-5 for a,b in zip(positions[0],positions[-1])), name
    assert max(sum((a-b)**2 for a,b in zip(p,positions[0])) for p in positions) > .01, name
    animated.add(name)
assert animated == expected, animated
report = {'result':'PASS','bytes':len(data),'meshes':sorted(mesh_nodes),'animation':animation['name'],'animatedParts':len(animated),'durationSeconds':times[-1][0]-times[0][0],'embeddedTextures':len(doc['images']),'restoredAtEnd':True,'sceneCount':len(doc['scenes'])}
(root/'assets/blender/chair-glb-validation.json').write_text(json.dumps(report,indent=2))
print(json.dumps(report,indent=2))
