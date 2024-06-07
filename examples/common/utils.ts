/*
 * If not stated otherwise in this file or this component's LICENSE file the
 * following copyright and licenses apply:
 *
 * Copyright 2023 Comcast Cable Communications Management, LLC.
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

import type {
  Dimensions,
  NodeTextLoadedPayload,
  CoreNode,
} from '@lightningjs/renderer';
import type { CoreTextNode } from '../../dist/src/core/CoreTextNode.js';

export async function waitForLoadedDimensions(
  node: CoreNode | CoreTextNode,
): Promise<Dimensions> {
  return new Promise((resolve) => {
    node.once('loaded', (_node: CoreNode, payload: NodeTextLoadedPayload) => {
      const { width, height } = payload.dimensions;
      resolve({
        width,
        height,
      });
    });
  });
}
