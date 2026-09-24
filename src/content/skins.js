export const SKINS = [
  { id: "lime", name: "Glow Lime", price: 0, color: 0xc6ff4a, emissive: 0x6bff1a },
  { id: "cyan", name: "Electric Cyan", price: 50, color: 0x3df2ff, emissive: 0x00c2d6 },
  { id: "magenta", name: "Hot Magenta", price: 100, color: 0xff3cac, emissive: 0xff0077 },
  { id: "gold", name: "Sun Gold", price: 250, color: 0xffd166, emissive: 0xff9f1c },
  { id: "ice", name: "Ice Glass", price: 250, color: 0xd0f4ff, emissive: 0x7ad7ff },
  { id: "ember", name: "Ember", price: 400, color: 0xff6b35, emissive: 0xff2a00 },
  { id: "honey", name: "Honey", price: 300, color: 0xffc857, emissive: 0xffaa00 },
  { id: "mint", name: "Mint Crystal", price: 350, color: 0x7dffc3, emissive: 0x2bffa8 },
  { id: "void", name: "Void", price: 600, color: 0x7a5cff, emissive: 0x4a22ff },
  { id: "rainbow", name: "Prism", price: 1200, color: 0xffffff, emissive: 0xff66cc, iap: true },
];

export function getSkin(id) {
  return SKINS.find((s) => s.id === id) || SKINS[0];
}
