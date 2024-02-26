from app import constants
import json


class AddCredentials:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        if request.content_type == 'application/json' and request.path.__contains__('/o/token/'):
            try:
                # json body -> python dict
                body = json.loads(request.body)

                body['client_id'] = constants.CLIENT_ID
                body['client_secret'] = constants.CLIENT_SECRET
                body['grant_type'] = constants.GRANT_TYPE

                # python dict -> json body
                modified_body = json.dumps(body)

                # assign it into request again
                request._body = modified_body.encode('utf-8')
            except json.JSONDecodeError:
                pass

        response = self.get_response(request)

        return response
