import { UpdateType, type CoreNode } from './CoreNode.js';
import type { Matrix3d } from './lib/Matrix3d.js';
import type { RenderCoords } from './lib/RenderCoords.js';
import type { RenderTexture } from './textures/RenderTexture.js';

export interface CoreTexturizerOptions {
  enableRTT: boolean;
}

export class CoreTexturizer {
  renderTexture: RenderTexture | null = null;
  rttTransform?: Matrix3d;
  rttCoords?: RenderCoords;
  rttEnabled = false;
  rttRequested = false;

  constructor(readonly node: CoreNode) {}

  initRTT() {
    this.rttEnabled = true;
    this.renderTexture = this.node.stage.txManager.createTexture(
      'RenderTexture',
      {
        width: this.node.width,
        height: this.node.height,
      },
    );
  }

  loadRenderTexture() {
    if (this.rttEnabled === false || this.renderTexture === null) {
      return;
    }
    if (this.renderTexture.state === 'loaded') {
      this.node.stage.renderer.renderToTexture(this.node);
      return;
    }
    this.node.stage.txManager.loadTexture(this.renderTexture, true);
    this.renderTexture.once('loaded', () => {
      this.node.stage.renderer.renderToTexture(this.node);
      this.node.setUpdateType(UpdateType.IsRenderable);
    });
    this.renderTexture.setRenderableOwner(this, true);
  }

  unloadRenderTexture() {
    if (this.rttEnabled === false || this.renderTexture === null) {
      return;
    }
    this.renderTexture.setRenderableOwner(this, false);
    this.renderTexture = null;
    this.rttCoords = undefined;
    this.rttTransform = undefined;
  }

  updateRenderTexture() {
    if (this.renderTexture !== null) {
      this.renderTexture.setRenderableOwner(this, false);
    }
    this.renderTexture = this.node.stage.txManager.createTexture(
      'RenderTexture',
      {
        width: this.node.width,
        height: this.node.height,
      },
    );
  }

  requestRTT() {
    this.rttRequested = true;
    this.node.setUpdateType(UpdateType.RenderTexture);
  }

  destroy() {
    if (this.rttEnabled === true) {
      this.unloadRenderTexture();
    }
  }
}
