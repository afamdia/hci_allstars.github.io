# HCI allstars PQ server

If you want to run it, first follow all of the instructions in `STEP 1`.
Then, whenever you want to work on it, follow the instructions in `STEP 2`.

## STEP 1: To run the server ON FIRST RUN:

- Make sure python is installed
- Initialize a python environment `python3 -m venv .venv`
- Activate the environment `. .venv/bin/activate`
- Install the dependencies `pip install -r requirements.txt`
- deactivate `deactivate`

## STEP 2: To run the server

- Make sure you're in the venv `. .venv/bin/activate`
- Run the server `flask --app server run`
- When you're ready to stop `deactivate`

## For me:

To save the deps it's `pip freeze --local > requirements.txt`

GET all posts: curl http://127.0.0.1:5000/post

Create a post: curl -X POST "http://127.0.0.1:5000/post?content=New%20post&location=10"

Upvote a post: curl -X POST http://127.0.0.1:5000/post/1?action=upvote

Delete a post: curl -X DELETE http://127.0.0.1:5000/post/1


