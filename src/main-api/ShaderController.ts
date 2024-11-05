/*
 * If not stated otherwise in this file or this component's LICENSE file the
 * following copyright and licenses apply:
 *
 * Copyright 2024 Comcast Cable Communications Management, LLC.
 *
 * Licensed under the Apache License, Version 2.0 (the License);
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/* eslint-disable @typescript-eslint/no-explicit-any */
import type { WebGlCoreShader } from '../../exports/index.js';
import type { ShaderMap } from '../core/CoreShaderManager.js';
import type { ExtractProps } from '../core/CoreTextureManager.js';
import type { Stage } from '../core/Stage.js';
import type { CoreShader } from '../core/renderers/CoreShader.js';
import type { UnsupportedShader } from '../core/renderers/canvas/shaders/UnsupportedShader.js';

/**
 * Shader Controller Base Interface
 *
 * @remarks
 * Used directly this interface is like an `any` type for Shader Controllers.
 * But it is also used as a base for more specific Shader Controller interfaces.
 */
export interface BaseShaderController {
  type: keyof ShaderMap;
  shader: CoreShader;
  props: Record<string, any>;
  getResolvedProps: () => Record<string, any> | null;
}

export type ShaderControllerConfig<S> = {
  type: S;
  shader: WebGlCoreShader | UnsupportedShader;
  props?: Record<string, unknown>;
  stage: Stage;
};
/**
 * Shader Controller Class
 *
 * @remarks
 * This class is used to control shader props.
 */

export class ShaderController<S extends keyof ShaderMap>
  implements BaseShaderController
{
  private resolvedProps: Record<string, unknown> | null = null;
  readonly type: S;
  readonly shader: WebGlCoreShader | UnsupportedShader;

  props: Record<string, unknown> = {};
  constructor(config: ShaderControllerConfig<S>) {
    (this.type = config.type),
      (this.shader = config.shader),
      (this.resolvedProps = config.props || {});

    const definedProps = {};
    if (this.resolvedProps !== undefined) {
      const keys = Object.keys(this.resolvedProps);
      const l = keys.length;
      for (let i = 0; i < l; i++) {
        const name = keys[i]!;
        Object.defineProperty(definedProps, name, {
          get: () => {
            return this.resolvedProps![name];
          },
          set: (value) => {
            this.resolvedProps![name] = value;
            config.stage.requestRender();
          },
        });
      }
    }
    this.props = definedProps;
  }

  getResolvedProps() {
    return this.resolvedProps;
  }
}
