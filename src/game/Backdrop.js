import * as THREE from "three";
import { makeSkyTexture } from "./look.js";
import { worldForLevel, sunPosition } from "../content/themes.js";
import { isSharedGeo, lambert, sharedGeos } from "./gpu.js";
import { AdvancedSkySystem } from "./BackdropPro.js";
import { WeatherSystem } from "./CloudSystem.js";
import { TerrainSystem } from "./TerrainSystem.js";
import { AnimatedElements } from "./EnvironmentalLife.js";

export class Backdrop {
  constructor(scene) {
    this.group = new THREE.Group();
    scene.add(this.group);
    this.far = new THREE.Group();
    this.mid = new THREE.Group();
    this.group.add(this.far, this.mid);
    const geo = sharedGeos();
    this._dummy = new THREE.Object3D();

    this._skyMat = new THREE.MeshBasicMaterial({ side: THREE.BackSide, depthWrite: false, fog: false });
    this.sky = new THREE.Mesh(geo.sky, this._skyMat);
    this.sky.visible = false;
    this.group.add(this.sky);

    this.sun = new THREE.Mesh(geo.sun, new THREE.MeshBasicMaterial({ color: 0xfff0a8, fog: false }));
    this.sun.visible = false;
    this.sun.position.set(-16, 20, 48);
    this.sun.rotation.y = Math.PI;
    this.far.add(this.sun);

    this.skyPro = new AdvancedSkySystem(this.group, "meadow", 0.14);
    this.weather = new WeatherSystem(this.group);
    this.terrain = new TerrainSystem(this.group);
    this.life = new AnimatedElements(this.group);

    this.haze = new THREE.Mesh(
      geo.haze,
      new THREE.MeshBasicMaterial({
        color: 0xd8f0c8,
        transparent: true,
        opacity: 0.35,
        depthWrite: false,
        fog: false,
      })
    );
    this.haze.position.set(0, 4, 54);
    this.far.add(this.haze);

    this.farMat = lambert(0x6a8a5a, 0x2a4a28, 0.12);
    this.midMat = lambert(0x5a7a4a, 0x244018, 0.1);
    this.capMat = lambert(0xe8eef0, 0xc8b0e8, 0.06);

    const farXs = [-26, -20, -14.2, 14.2, 20, 26];
    this.farHills = new THREE.InstancedMesh(geo.cone, this.farMat, farXs.length);
    this.farCaps = new THREE.InstancedMesh(geo.cone, this.capMat, farXs.length);
    this.farHills.frustumCulled = false;
    this.farCaps.frustumCulled = false;
    for (let i = 0; i < farXs.length; i++) {
      const s = 7.2 + (i % 3) * 1.6;
      this._dummy.position.set(farXs[i], s * 0.28, 56 + (i % 3) * 4);
      this._dummy.rotation.set(0, 0, 0);
      this._dummy.scale.set(s * 0.9, s, s * 0.7);
      this._dummy.updateMatrix();
      this.farHills.setMatrixAt(i, this._dummy.matrix);
      this._dummy.position.set(farXs[i], s * 0.72, 56 + (i % 3) * 4);
      this._dummy.scale.set(s * 0.32, s * 0.22, s * 0.26);
      this._dummy.updateMatrix();
      this.farCaps.setMatrixAt(i, this._dummy.matrix);
    }
    this.farHills.instanceMatrix.needsUpdate = true;
    this.farCaps.instanceMatrix.needsUpdate = true;
    this.farHills.visible = false;
    this.farCaps.visible = false;
    this.far.add(this.farHills, this.farCaps);

    const midXs = [-17, -12.6, 12.6, 17];
    this.midCones = new THREE.InstancedMesh(geo.cone, this.midMat, 2);
    this.midBoxes = new THREE.InstancedMesh(geo.box, this.midMat, 2);
    this.midCones.frustumCulled = false;
    this.midBoxes.frustumCulled = false;
    let ci = 0;
    let bi = 0;
    for (let i = 0; i < midXs.length; i++) {
      const s = 4.4 + (i % 2) * 1.1;
      this._dummy.position.set(midXs[i], s * 0.22, 30 + (i % 2) * 5);
      this._dummy.rotation.set(0, 0, 0);
      if (i % 2) this._dummy.scale.set(s * 0.85 * 1.2, s * 0.7, s * 0.7);
      else this._dummy.scale.set(s * 0.85, s, s * 0.7);
      this._dummy.updateMatrix();
      if (i % 2) this.midBoxes.setMatrixAt(bi++, this._dummy.matrix);
      else this.midCones.setMatrixAt(ci++, this._dummy.matrix);
    }
    this.midCones.instanceMatrix.needsUpdate = true;
    this.midBoxes.instanceMatrix.needsUpdate = true;
    this.midCones.visible = false;
    this.midBoxes.visible = false;
    this.mid.add(this.midCones, this.midBoxes);

    this.cloudMat = new THREE.MeshLambertMaterial({ color: 0xf4f8fc, transparent: true, opacity: 0.92 });
    this.clouds = new THREE.Group();
    this.cloudMesh = new THREE.InstancedMesh(geo.sphere, this.cloudMat, 8);
    this.cloudMesh.frustumCulled = false;
    for (let i = 0; i < 8; i++) {
      const r = 1.4 + (i % 3) * 0.4;
      this._dummy.position.set((i - 3.5) * 6.5, 12 + (i % 3) * 1.6, 22 + (i % 4) * 5);
      this._dummy.rotation.set(0, 0, 0);
      this._dummy.scale.set(r * 1.8, r * 0.55, r * 1.1);
      this._dummy.updateMatrix();
      this.cloudMesh.setMatrixAt(i, this._dummy.matrix);
    }
    this.cloudMesh.instanceMatrix.needsUpdate = true;
    this.clouds.add(this.cloudMesh);
    this.group.add(this.clouds);

    this.flashMesh = new THREE.Mesh(
      geo.flash,
      new THREE.MeshBasicMaterial({
        color: 0xd8eeff,
        transparent: true,
        opacity: 0,
        depthWrite: false,
        fog: false,
      })
    );
    this.flashMesh.position.set(0, 16, 8);
    this.flashMesh.visible = false;
    this.far.add(this.flashMesh);

    this.bolt = new THREE.Mesh(geo.bolt, new THREE.MeshBasicMaterial({ color: 0xf0e8ff, fog: false }));
    this.bolt.position.set(8, 16, 36);
    this.bolt.visible = false;
    this.far.add(this.bolt);
    this.storm = false;
    this.flash = 0;
    this.struck = false;
    this._stormWait = 4;
    this._flashHold = 0;
    this._stormChance = 0.4;

    this._lifeDummy = this._dummy;
    this.birdMat = lambert(0x2a3040, 0x101418, 0.04);
    this.wingMat = lambert(0xf4f0e8, 0x887868, 0.05);
    this.birds = new THREE.InstancedMesh(geo.bird, this.birdMat, 14);
    this.wings = new THREE.InstancedMesh(geo.wing, this.wingMat, 14);
    this.birds.frustumCulled = false;
    this.wings.frustumCulled = false;
    this.group.add(this.birds, this.wings);

    this.critterMat = lambert(0xc8a070, 0x5a3a20, 0.06);
    this.critters = new THREE.InstancedMesh(geo.critter, this.critterMat, 10);
    this.critters.frustumCulled = false;
    this.group.add(this.critters);

    this.applyWorld(worldForLevel(1));
  }

  applyWorld(world) {
    if (!world) return;
    this._skyMat.map = makeSkyTexture(world);
    this._skyMat.needsUpdate = true;
    this.sun.material.color.setHex(world.sun);
    this.sun.visible = false;
    this.sky.visible = false;
    this.haze.material.color.setHex(world.haze);
    this.haze.material.opacity = world.storm ? 0.62 : world.id === "nightfen" ? 0.22 : 0.34;
    this.farMat.color.setHex(world.far);
    this.farMat.emissive.setHex(world.pineEm || world.far);
    this.farMat.emissiveIntensity = world.id === "nightfen" || world.id === "crown" || world.id === "ember" ? 0.18 : 0.1;
    this.midMat.color.setHex(world.mid);
    this.midMat.emissive.setHex(world.rockEm || world.mid);
    this.midMat.emissiveIntensity = world.id === "lagoon" || world.id === "prism" ? 0.14 : 0.08;
    this.capMat.color.setHex(world.cap);
    if (this.farCaps) this.farCaps.visible = false;
    this.cloudMat.color.setHex(world.cloud);
    this.clouds.visible = false;
    this.birdMat.color.setHex(world.id === "nightfen" || world.id === "crown" ? 0x1a1028 : 0x243040);
    this.wingMat.color.setHex(world.cloud);
    this.critterMat.color.setHex(world.trunk || 0xa07848);
    this.storm = false;
    const sun = sunPosition(world.sunT);
    this.flash = 0;
    this.struck = false;
    this._flashHold = 0;
    this._sunY = world.id === "crown" ? 6.2 : sun.y + 6;
    this._stormWait = this.storm ? 1.2 : 4;
    if (this.flashMesh) this.flashMesh.visible = this.storm;
    if (this.bolt) this.bolt.visible = false;
    this.cloudMat.opacity = this.storm ? 0.78 : 0.92;
    this.birds.visible = false;
    this.wings.visible = false;
    this.critters.visible = false;
    if (this.skyPro) {
      this.skyPro.skipStorm = true;
      this.skyPro.updateForWorld(world.id);
      this.skyPro.updateTimeOfDay(world.sunT ?? 0.5);
      this.skyPro.setWeatherIntensity(world.storm ? 0.9 : this.skyPro.weather);
      if (world.id === "nightfen") this.skyPro.enableNight();
      if (this.skyPro.wisps) this.skyPro.wisps.visible = false;
      if (this.skyPro.ash) this.skyPro.ash.visible = false;
      if (this.skyPro.flashMesh) this.skyPro.flashMesh.visible = false;
    }
    if (this.weather) {
      this.weather.setWorld(world.id);
      if (world.storm) this.weather.beginStorm();
    }
    if (this.terrain) {
      this.terrain.setWorldTerrain(world.id);
      if (this.terrain.propMesh) this.terrain.propMesh.visible = false;
    }
    if (this.life) {
      this.life.setWorld(world.id);
      this.life.playWeatherSounds(world.storm ? "storm" : this.life.profile.particles === "snow" ? "snow" : "sunny");
      this.life.setWindIntensity(this.life.profile.wind);
      if (this.weather?.dust && this.life.profile.particles === "dust") this.weather.dust.visible = false;
    }
  }

  consumeStrike() {
    if (this.weather?.consumeStrike?.()) return true;
    if (this.skyPro?.consumeStrike?.()) return true;
    if (!this.struck) return false;
    this.struck = false;
    return true;
  }

  consumeThunder() {
    return !!this.weather?.consumeThunder?.();
  }

  tick(dt, crowdZ, reduceMotion, crowdX = 0) {
    this.sky.position.z = crowdZ;
    this.far.position.z = crowdZ;
    this.mid.position.z = crowdZ;
    this.clouds.position.z = crowdZ;
    this.birds.position.z = crowdZ;
    this.wings.position.z = crowdZ;
    this.critters.position.z = crowdZ;
    this.skyPro?.follow?.(crowdX, crowdZ);
    this.skyPro?.tick?.(dt, reduceMotion);
    this.weather?.tick?.(dt, reduceMotion, crowdZ);
    this.terrain?.tick?.(dt, reduceMotion, crowdZ, crowdX);
    const wx = this.weather;
    if (this.life) {
      const gust = wx ? Math.min(1, wx.speedMul * (wx.profile?.speed || 0.01) * 18) : this.life.wind;
      this.life.setWindIntensity(Math.max(this.life.profile.wind * 0.5, gust));
      this.life.tick(dt, reduceMotion, crowdZ, crowdX);
    }
    if (this.skyPro) this.flash = Math.max(this.flash || 0, this.skyPro.flash || 0);
    if (this.weather) this.flash = Math.max(this.flash || 0, this.weather.flash || 0);
    const t = performance.now() * 0.001;
    if (this.storm) {
      this._stormWait -= dt;
      if (this._stormWait <= 0) {
        this._stormWait = 4 + Math.random();
        if (Math.random() < this._stormChance) {
          this._flashHold = 0.15;
          this.flash = 1;
          this.struck = true;
          if (this.bolt) {
            this.bolt.visible = !reduceMotion;
            this.bolt.position.x = (Math.random() - 0.5) * 26;
            this.bolt.rotation.z = (Math.random() - 0.5) * 0.35;
          }
        }
      }
      if (this._flashHold > 0) {
        this._flashHold -= dt;
        this.flash = 1;
      } else {
        this.flash = Math.max(0, this.flash - dt / 0.1);
      }
      if (this.flashMesh) {
        this.flashMesh.material.opacity = this.flash * 0.78;
        this.flashMesh.visible = this.flash > 0.02;
      }
      if (this.bolt && this.flash < 0.35) this.bolt.visible = false;
    }
    if (!reduceMotion) {
      this.far.position.x = Math.sin(crowdZ * 0.004) * 0.28;
      this.mid.position.x = Math.sin(crowdZ * 0.01) * 0.45;
      this.clouds.position.x = Math.sin(crowdZ * 0.006) * 1.2;
      this.sun.position.y = (this._sunY || 20) + Math.sin(t * 0.15) * 0.6;
    }
    if (this.birds.visible) {
      for (let i = 0; i < 14; i++) {
        const side = i % 2 === 0 ? -1 : 1;
        const x = side * (10 + (i % 5) * 2.2) + Math.sin(t * 0.7 + i) * 2.4;
        const y = 9.5 + (i % 4) * 1.1 + Math.sin(t * 1.8 + i * 0.7) * 0.55;
        const z = ((i * 11) % 36) - 8;
        const yaw = side > 0 ? 0.4 : 2.7;
        this._lifeDummy.position.set(x, y, z);
        this._lifeDummy.rotation.set(0.15, yaw, Math.sin(t * 9 + i) * 0.2);
        this._lifeDummy.scale.setScalar(1);
        this._lifeDummy.updateMatrix();
        this.birds.setMatrixAt(i, this._lifeDummy.matrix);
        const flap = 1 + Math.sin(t * 14 + i) * (reduceMotion ? 0.05 : 0.55);
        this._lifeDummy.scale.set(flap, 1, 1);
        this._lifeDummy.updateMatrix();
        this.wings.setMatrixAt(i, this._lifeDummy.matrix);
      }
      this.birds.instanceMatrix.needsUpdate = true;
      this.wings.instanceMatrix.needsUpdate = true;
    }
    if (this.critters.visible) {
      for (let i = 0; i < 10; i++) {
        const side = i % 2 === 0 ? -1 : 1;
        const x = side * (7.6 + (i % 3) * 0.85);
        const hop = Math.abs(Math.sin(t * 5.4 + i * 1.1));
        this._lifeDummy.position.set(x, 0.28 + hop * 0.16, ((i * 13) % 42) - 6);
        this._lifeDummy.rotation.set(0, side > 0 ? 0.2 : 3, 0);
        this._lifeDummy.scale.set(1.1 + (i % 3) * 0.15, 0.7 + hop * 0.12, 1.4);
        this._lifeDummy.updateMatrix();
        this.critters.setMatrixAt(i, this._lifeDummy.matrix);
      }
      this.critters.instanceMatrix.needsUpdate = true;
    }
  }

  dispose() {
    this.life?.dispose?.();
    this.terrain?.dispose?.();
    this.weather?.dispose?.();
    this.skyPro?.dispose?.();
    this.group.traverse((o) => {
      if (o.geometry && !isSharedGeo(o.geometry)) o.geometry.dispose?.();
      if (o.material && !o.material.map) o.material?.dispose?.();
    });
    this.group.removeFromParent();
  }
}
