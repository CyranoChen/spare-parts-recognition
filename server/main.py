# -*- coding: utf-8 -*-
import os
import json
import base64
import random

import tornado.httpserver
import tornado.ioloop
import tornado.options
import tornado.web

from tornado.options import define, options
from tornado.escape import json_decode

import config
import utils
from recognize import recognize_items, load_generate_items, export_results

define("port", default=8000, help="Spare Parts recognition Server Hub", type=int)
define("ssl_port", default=8443, help="Spare Parts recognition Server Hub", type=int)


class MainHandler(tornado.web.RequestHandler):
    def set_default_headers(self):
        self.set_header('Access-Control-Allow-Origin', '*')
        self.set_header('Access-Control-Allow-Methods', 'POST')
        self.set_header('Access-Control-Allow-Headers', '*')
        self.set_header('Cache-Control', 'no-cache')

    def post(self, *args, **kwargs):
        content = self.request.body
        if not content or content == "":
            self.write(json.dumps({"state": "error", "message": "invalid post data"}))
            return

        input_data = json.loads(content)
        print('input:', input_data['filename'])

        img = base64.b64decode(input_data['image']
                               .replace('data:image/jpeg;base64,', '')
                               .replace('data:image/png;base64,', ''))
        with open(config.SAMPLE_FILEPATH + '/' + input_data['filename'], 'wb') as img_file:
            img_file.write(img)

        results = recognize_items(input_data['filename'])
        filename = utils.remove_file_ext(input_data['filename'])

        if len(results) > 0 and 'similarVectors' in results[0]:
            ret_data = [r for r in results[0]['similarVectors'] if r['score'] >= config.THRESHOLD_SIMILAR]

            ### hardcode required by Darius
            if config.FLAG_HARDCODE:
                fake_ret_data = []
                for r in ret_data:
                    if r['id'].upper() == 'CW0001':
                        fake_ret_data.append({'id': 'CW0001', 'score': random.uniform(0.92, 0.98)})
                    else:
                        fake_ret_data.append(r)
                ret_data = fake_ret_data
            ###

            ret_data.sort(key=lambda x: x['score'], reverse=True)
            resp = json.dumps({"state": "success", "filename": filename, "data": export_results(ret_data)})
        else:
            resp = json.dumps({"state": "fail", "filename": filename, "data": []})

        print(resp)
        self.write(resp)

    def get(self):
        pass

    def data_received(self, chunk):
        pass


if __name__ == "__main__":
    load_generate_items()
    print('server started')

    tornado.options.parse_command_line()
    app = tornado.web.Application(handlers=[('/api/recognize', MainHandler)])

    https_server = tornado.httpserver.HTTPServer(app, ssl_options={
        "certfile": "./cert/server.crt",
        "keyfile": "./cert/private.pem",
    })
    https_server.listen(options.ssl_port)

    http_server = tornado.httpserver.HTTPServer(app)
    http_server.listen(options.port)
    tornado.ioloop.IOLoop.instance().start()
