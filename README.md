## How to use?
create a .env file in the route, with the following content
```
PERSONAL_ACCESS_TOKEN=YOUR_GITHUB_ACCESS_TOKEN
```

then run `yarn start`

example requests:

### Init a repository
```
POST /init HTTP/1.1
Host: localhost:3000
Content-Type: application/json

{
	"user": "my-github-name",
	"repoName": "my-repo-name",
    "branch": "master"
}
```

### Update routes
```
POST /routes HTTP/1.1
Host: localhost:3000
Content-Type: application/json

{
	"routes": [
  {
    "method": "get",
    "path": "/",
    "handler": "function(req, reply) {\n            reply.send({\n                foo: 'lorem'\n            })\n          }"
  },
  {
    "method": "get",
    "path": "/foo",
    "handler": "function(req, reply) {\n            reply.send({\n                foo: 'foo'\n            })\n          }"
  }
],
	"user": "my-github-name",
	"repoName": "my-repo-name",
    "message": "this is the commit message",
    "branch": "master"
}
```