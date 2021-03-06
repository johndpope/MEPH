﻿/*
  Ported to JavaScript by Lazar Laszlo 2011 
  
  lazarsoft@gmail.com, www.lazarsoft.info
  
*/

/*
*
* Copyright 2007 ZXing authors
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*      http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

MEPH.define('MEPH.qrcode.version.ECB', {
    initialize: function (count, dataCodewords) {
        var me = this;
        me.count = count;
        me.dataCodewords = dataCodewords;
        Object.defineProperty(me, 'Count', {
            get: function () {
                return me.count;
            }
        });
        Object.defineProperty(me, 'DataCodewords', {
            get: function () {
                return this.dataCodewords;
            }
        });
    }
});