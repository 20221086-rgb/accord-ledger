from flask import jsonify


def success(data=None, message="OK", status=200):
    body = {"success": True, "data": data, "message": message}
    return jsonify(body), status


def error(code: str, message: str, status=400):
    body = {
        "success": False,
        "error": {"code": code, "message": message},
    }
    return jsonify(body), status
