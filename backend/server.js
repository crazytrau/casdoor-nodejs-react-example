// Copyright 2023 The Casdoor Authors. All Rights Reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

const url = require('url')
const { SDK } = require('casdoor-nodejs-sdk');
const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors')

//init sdk
const cert = `
-----BEGIN CERTIFICATE-----
MIIE3TCCAsWgAwIBAgIDAeJAMA0GCSqGSIb3DQEBCwUAMCgxDjAMBgNVBAoTBWFk
bWluMRYwFAYDVQQDEw1jZXJ0LWJ1aWx0LWluMB4XDTIzMDcyNjE4MTI1NloXDTQz
MDcyNjE4MTI1NlowKDEOMAwGA1UEChMFYWRtaW4xFjAUBgNVBAMTDWNlcnQtYnVp
bHQtaW4wggIiMA0GCSqGSIb3DQEBAQUAA4ICDwAwggIKAoICAQC28F3m1za8n3Zd
qANdMItOG2msi7g5bn8VjvUscXWHPA6rlqOWzbZhDOtQHJloXaGwaiWJa2gkqDha
hu7PXBOVAYd9N9oi+d33J4LdiOGdOIs+vwkMujKtAPe/vByFcTVQjeWPuHGibW6w
6FhHznkXfSHJC8Y7FqiuwOXCzsbHxlOWHs9lt6qs+vQ4J3b2HtIYP1x0nQju7U46
/cJ6+N8j3UU0r1eDBJpnK3hCv8em8uQpVgG+ZrKju8Eb1bStlErRUYjjTINZeDjW
JEwvd6z8DANsKOIkJvzsAg9Z2z718Mnitea/+8YioQe1BpRLcKn6Zn9WvCJ8LNa0
PVpyicrr5HYAk3Apu3vm5V2ASx6NWt6DdSJKlpQE2QVYv8yNQgdK5ouD9ORqfqQP
ww/EHuqDNFlMXnlGDDRv9X/+86qtP1oVDRDlRQNm/ngxG+CXLpDkMrZ+VB4+PMUp
FdBZX4y7Mi++qqN6q8NvWvP7aO9Qu/vhmOpPyMq2/nv9pOR/bSemgPzd8a3O5OIH
bErtXhzZCBA/7FSuTOahecUzyxUjdl5kR/XapPA5Jsfpos75wqj7302o8lgmK08c
8FBNXIpN3fp9RpxaPkDYx2ps0HrhuToWp96JDPlmp781PINpDFshuMAHMJOQ/t4K
F6xX8id6m42D+vgCXCgfwTZhV8FhkQIDAQABoxAwDjAMBgNVHRMBAf8EAjAAMA0G
CSqGSIb3DQEBCwUAA4ICAQCeVmeVwCruN3YsQiU+K2vlcHKd/C97jLz9UhCGnEyj
x2mxgXM2uo06iUBSlk/Am+2FUGAWtaekpzbs7EdsD5M+Snag9HZBb6pjYrnbRE95
2HYbF4CpZVmn9ym7c0bwWguRJAwBPw/RFhglehdU504xiDeGiiRnN/U3zIdfMJGU
HgOQiXsppLkU0iNU1ARBp26uOIMLxEV/2l2IqUjzyxlZujotJoX2jXUOruvkCJeS
/iddB1E7qPDDPzg7d5mocfTSZiPOVyOMiJq4NRx61LquNLeMxiyIq4VR5TVBGfY2
7xWsPaOaDpfmuRMHsHhTdFjDnHnx5tlJATIBemksl0lkl3f8toHaSG/DnXtL0YXS
gWUu5a1gzYaHMU9xxpDUXjSuzKKbdTjbO0Tg40j8uIGPUbXZdYVmmfLm09URkmHU
aw/aAZVJEeU0g4nsPBX4+Wes8gR3dgAcaCn7Yyan0Mtqsc/69V4icUy9PwC0Lr/y
qZ/l/ayAGA+5vr9k2JJm5lK8T8luVFxaxq/knQNO7mXvJwqutF0M1uvTEyzQHDfS
Zlc02LUk3x9bfyh0SLAQioATMvO2dX2SKOO5BiXCi7pyGvoM0Oi5zFf9bcf7NTqh
TfZTW+EjMkR5fTfrzg7Kl+YRgLFo+PBmSvqaoaQzo0mVu4yWSEfjjSsOMsKLykTA
vQ==
-----END CERTIFICATE-----

`;

const authCfg = {
  endpoint: 'http://host.docker.internal:8000',
  clientId: 'c901ac858f5ea1b681d3',
  clientSecret: 'c8a3d0cfdcd3d17226a42348c850027ff4dba55b',
  certificate: cert,
  orgName: 'crazytrau-org',
}

const sdk = new SDK(authCfg);

const app = express();

app.use(cors({
  origin: 'http://localhost:9000',
  credentials: true
}))

app.get('/', (req, res) => {
  fs.readFile(path.resolve(__dirname, './index.html'), (err, data) => {
    res.setHeader('Content-Type', 'text/html');
    res.send(data);
  });
});

app.get('/api/getUserInfo', (req, res) => {
  let urlObj = url.parse(req.url, true).query;
  console.log(urlObj)
  let user = sdk.parseJwtToken(urlObj.token);
  console.log(user)
  res.send(JSON.stringify(user));
});

app.post('*', (req, res) => {
  let urlObj = url.parse(req.url, true).query;
  sdk.getAuthToken(urlObj.code).then(result => {
    res.send(JSON.stringify({ token: result }));
  });
});

app.listen(8080, () => {
  console.log('Server listening at http://localhost:8080');
});
