"""Run in the open Blender scene; preserve it and inspect connected mesh islands."""
import bpy
import json
from pathlib import Path
from mathutils import Vector

ROOT = Path(r"D:\DEV\Refinatto Marcenaria")
OUT = ROOT / "assets" / "blender"
OUT.mkdir(parents=True, exist_ok=True)
backup = OUT / "chair-original.blend"
if not backup.exists():
    bpy.ops.wm.save_as_mainfile(filepath=str(backup), copy=True)

obj = bpy.data.objects["geometry_0"]
mesh = obj.data
adj = [[] for _ in mesh.vertices]
for edge in mesh.edges:
    a, b = edge.vertices
    adj[a].append(b)
    adj[b].append(a)
seen = set()
islands = []
for vert in mesh.vertices:
    if vert.index in seen:
        continue
    stack = [vert.index]
    seen.add(vert.index)
    ids = []
    while stack:
        i = stack.pop()
        ids.append(i)
        for j in adj[i]:
            if j not in seen:
                seen.add(j)
                stack.append(j)
    coords = [obj.matrix_world @ mesh.vertices[i].co for i in ids]
    islands.append({"vertices": len(ids), "min": [min(v[a] for v in coords) for a in range(3)], "max": [max(v[a] for v in coords) for a in range(3)], "indices": ids})
report = {
    "object": obj.name,
    "vertices": len(mesh.vertices),
    "polygons": len(mesh.polygons),
    "dimensions": list(obj.dimensions),
    "matrix_world": [list(row) for row in obj.matrix_world],
    "materials": [m.name for m in mesh.materials],
    "images": [{"name": i.name, "size": list(i.size), "filepath": i.filepath, "packed": bool(i.packed_file)} for i in bpy.data.images],
    "islands": sorted(islands, key=lambda i: -i["vertices"]),
}
(OUT / "chair-inspection.json").write_text(json.dumps(report, indent=2), encoding="utf-8")
print("CHAIR AUDIT:", len(islands), "connected islands; backup saved:", backup)
