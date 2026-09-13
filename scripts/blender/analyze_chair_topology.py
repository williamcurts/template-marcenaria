import bpy
import json
from pathlib import Path

out = Path(r"D:\DEV\Refinatto Marcenaria\assets\blender")
obj = bpy.data.objects['geometry_0']
mesh = obj.data
parent = list(range(len(mesh.vertices)))
def root(a):
    while parent[a] != a:
        parent[a] = parent[parent[a]]
        a = parent[a]
    return a
def join(a,b):
    parent[root(a)] = root(b)
for edge in mesh.edges:
    join(*edge.vertices)
coords = {}
for v in mesh.vertices:
    key = tuple(round(c, 5) for c in v.co)
    if key in coords:
        join(v.index, coords[key])
    else:
        coords[key] = v.index
groups = {}
for v in mesh.vertices:
    groups.setdefault(root(v.index), []).append(v.index)
result = []
for ids in groups.values():
    points = [mesh.vertices[i].co for i in ids]
    result.append({'count':len(ids), 'min':[min(v[a] for v in points) for a in range(3)], 'max':[max(v[a] for v in points) for a in range(3)], 'indices':ids})
result.sort(key=lambda x:-x['count'])
(out/'chair-components.json').write_text(json.dumps(result,indent=2))
print('COMPONENTS', json.dumps([{k:v for k,v in r.items() if k!='indices'} for r in result]))
