# Usage

Link To GitHub Repo: https://github.com/afamdia/hci_allstars.github.io

To execute code in this directory:

## Activate frontend

```sh
cd frontend
npm run dev
```

Alternatively, if you'd like to see it in production environment, you'll need to compile it:
```sh
cd frontend
npm run build
npx serve@latest out
```

Both works, the latter one is more stable for production environment, but should produce the same result!


## Activate Backend

```sh
cd backend
# optionally, check if you have all the requirements
pip install -r requirements.txt
flask --app server run
```
