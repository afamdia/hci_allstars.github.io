from flask import Flask, jsonify, request
from flask_cors import CORS
import sqlite3

DEV = True

app = Flask(__name__)

if DEV:
    # Enable CORS for all routes
    CORS(app, resources={r"/*": {"origins": "*"}})


# Database connection function
def get_db_connection():
    conn = sqlite3.connect('posts.db')
    conn.row_factory = sqlite3.Row  # Allows dictionary-like row access
    return conn


# Initialize database and create posts table
def init_db():
    conn = get_db_connection()
    conn.execute('''
        CREATE TABLE IF NOT EXISTS posts (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            location TEXT NOT NULL,
            content TEXT NOT NULL,
            score INTEGER DEFAULT 0
        )
    ''')
    conn.commit()
    conn.close()


# Initialize database when the app starts
init_db()


# GET /post: Retrieve all posts
@app.route('/post', methods=['GET'])
def get_posts():
    conn = get_db_connection()
    posts = conn.execute('SELECT * FROM posts').fetchall()
    conn.close()
    return jsonify([dict(post) for post in posts])


# POST /post?content=xx&location=?: Create a new post
@app.route('/post', methods=['POST'])
def create_post():
    content = request.args.get('content')
    location = request.args.get('location')
    if not content or not location:
        return jsonify({"error": "Content and location are required"}), 400
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('INSERT INTO posts (location, content, score) VALUES (?, ?, 0)', (location, content))
    conn.commit()
    post_id = cursor.lastrowid
    conn.close()
    return jsonify({"id": post_id, "location": location, "content": content, "score": 0})


# POST /post/id?action=xx: Upvote or downvote a post
@app.route('/post/<int:id>', methods=['POST'])
def vote_post(id):
    action = request.args.get('action')
    if action not in ['upvote', 'downvote']:
        return jsonify({"error": "Invalid action"}), 400
    conn = get_db_connection()
    post = conn.execute('SELECT * FROM posts WHERE id = ?', (id,)).fetchone()
    if post is None:
        conn.close()
        return jsonify({"error": "Post not found"}), 404
    if action == 'upvote':
        new_score = post['score'] + 1
    else:  # downvote
        new_score = post['score'] - 1
    conn.execute('UPDATE posts SET score = ? WHERE id = ?', (new_score, id))
    conn.commit()
    conn.close()
    return jsonify({"id": id, "location": post['location'], "content": post['content'], "score": new_score})


# DELETE /post/id: Delete a post
@app.route('/post/<int:id>', methods=['DELETE'])
def delete_post(id):
    conn = get_db_connection()
    post = conn.execute('SELECT * FROM posts WHERE id = ?', (id,)).fetchone()
    if post is None:
        conn.close()
        return jsonify({"error": "Post not found"}), 404
    conn.execute('DELETE FROM posts WHERE id = ?', (id,))
    conn.commit()
    conn.close()
    return '', 200


if __name__ == '__main__':
    app.run(debug=True)
