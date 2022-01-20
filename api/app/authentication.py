from rest_framework.authentication import TokenAuthentication


class BearerTokenAuthentication(TokenAuthentication):
    def __init__(self):
        self.keyword = 'Bearer'
        super().__init__()
