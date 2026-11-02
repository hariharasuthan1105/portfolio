# KINGDOM OF CODE — 3D GLB ASSET MANIFEST
## THE OBSIDIAN CITADEL ASSET INVENTORY

This manifest documents all glTF 2.0 binary (`.glb`) 3D assets used in Section 01 (Homepage Hero — The Obsidian Citadel).

| Asset Name | Relative Path | Size | Primitives / Nodes | Materials / PBR | Embedded Animations | Source & License |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Gothic Castle Citadel** | `/models/gothic_citadel.glb` | ~147 KB | Multi-tiered central keep, 3 needle spires, lancet window apertures, flying buttresses, battlements, entrance arch | `Mat_ObsidianStone`, `Mat_GothicIron`, `Mat_WindowGlow`, `Mat_MachinedSilver` | Static Architecture | Custom Engineered AAA Procedural glTF (CC0 Public Domain) |
| **Stone Bridge & Stairs** | `/models/stone_bridge.glb` | ~267 KB | Stone deck roadway, gothic balustrades, tracery arches, iron fire braziers, ascending ceremonial stairs, upper portal dais | `Mat_WetStone` (puddle reflections), `Mat_DarkGranite`, `Mat_ObsidianStone`, `Mat_BrazierFlame` | Static Foreground Environment | Custom Engineered AAA Procedural glTF (CC0 Public Domain) |
| **Massive Circular Portal Gate** | `/models/portal_gate.glb` | ~214 KB | Concentric stone archway, 16 runic keystones, silver apex crest, dual silver rotating runic rings, side buttresses | `Mat_ObsidianStone`, `Mat_DarkGranite`, `Mat_MachinedSilver` | Pre-configured Gimbal Rings | Custom Engineered AAA Procedural glTF (CC0 Public Domain) |
| **Guardian Knight Statues** | `/models/guardian_statues.glb` | ~96 KB | Left and right colossal knight statues with hooded cowls, plate armor, and two-handed longswords resting tip-down | `Mat_DarkGranite`, `Mat_ObsidianStone`, `Mat_MachinedSilver` | Static Monuments | Custom Engineered AAA Procedural glTF (CC0 Public Domain) |
| **Hooded Explorer** | `/models/hooded_explorer.glb` | ~60 KB | Rigged character with hooded cowl, shadowed visage, layered armor, cape tail chain, back-sheathed broadsword | `Mat_DarkGranite`, `Mat_ObsidianStone`, `Mat_MachinedSilver`, `Mat_GothicIron` | `Idle` (3.0s breathing/sway), `Walk` (1.6s grounded cycle) | Custom Engineered AAA Procedural Rigged glTF (CC0 Public Domain) |
| **Gothic Fabric Banners** | `/models/gothic_banners.glb` | ~63 KB | Four banner installations (foreground left/right and mid-stairs left/right) on iron poles with crown/trident sigil | `Mat_GothicIron`, `Mat_DarkGranite`, `Mat_MachinedSilver` | `Wind` (2.4s natural cloth undulation) | Custom Engineered AAA Procedural glTF (CC0 Public Domain) |
| **Cliffs & Cascading Waterfalls** | `/models/cliff_waterfalls.glb` | ~138 KB | Tiered cliff rocks flanking the bridge, vertical waterfall planes, bottom mist/foam basin geometries | `Mat_DarkGranite`, `Mat_Waterfall` (translucent specular) | Continuous Shader / Mesh flow | Custom Engineered AAA Procedural glTF (CC0 Public Domain) |
| **Floating Obsidian Islands** | `/models/floating_islands.glb` | ~14 KB | Distant hovering inverted stalactite islands with gothic spires and upper plateaus | `Mat_DarkGranite`, `Mat_ObsidianStone`, `Mat_GothicIron` | Floating parallax anchors | Custom Engineered AAA Procedural glTF (CC0 Public Domain) |

**Total Combined 3D Asset Payload**: ~998 KB (< 1.0 MB)  
**glTF Specification**: 2.0 Binary (GLB) with Embedded Buffer Views  
**Texture & Normal Strategy**: Algorithmic PBR roughness variation, specular highlights, and emissive window glows for instantaneous, non-blocking rendering.
