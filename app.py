import json
import os

from flask import Flask, render_template, request, flash, redirect, url_for
from flask_mail import Mail, Message as MailMessage
import mysql.connector

from config import Config

app = Flask(__name__)
app.config.from_object(Config)

mail = Mail(app)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECTS_PATH = os.path.join(BASE_DIR, "data", "projects.json")


def get_db():
    """Return a MySQL connection."""
    return mysql.connector.connect(
        host=app.config["DB_HOST"],
        port=app.config["DB_PORT"],
        user=app.config["DB_USER"],
        password=app.config["DB_PASSWORD"],
        database=app.config["DB_NAME"],
    )


def init_db():
    """Create the contact_messages table if it doesn't exist."""
    try:
        conn = get_db()
        cursor = conn.cursor()
        cursor.execute(
            """
            CREATE TABLE IF NOT EXISTS contact_messages (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(100) NOT NULL,
                email VARCHAR(120) NOT NULL,
                subject VARCHAR(200) NOT NULL,
                message TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
            """
        )
        conn.commit()
        cursor.close()
        conn.close()
    except mysql.connector.Error as err:
        print(f"[DB INIT WARNING] Could not initialize database: {err}")


def load_projects():
    """Load projects from the JSON file."""
    try:
        with open(PROJECTS_PATH, "r", encoding="utf-8") as f:
            return json.load(f)
    except (FileNotFoundError, json.JSONDecodeError):
        return []


@app.route("/")
def index():
    projects = load_projects()
    featured = [p for p in projects if p.get("featured")]
    regular = [p for p in projects if not p.get("featured")]
    return render_template(
        "index.html",
        projects=projects,
        featured_project=featured[0] if featured else None,
        regular_projects=regular,
    )


@app.route("/contact", methods=["POST"])
def contact():
    name = request.form.get("name", "").strip()
    email = request.form.get("email", "").strip()
    subject = request.form.get("subject", "").strip()
    message = request.form.get("message", "").strip()

    if not all([name, email, subject, message]):
        flash("All fields are required.", "error")
        return redirect(url_for("index") + "#contact")

    if "@" not in email or "." not in email:
        flash("Please enter a valid email address.", "error")
        return redirect(url_for("index") + "#contact")

    # Save to database
    try:
        conn = get_db()
        cursor = conn.cursor()
        cursor.execute(
            "INSERT INTO contact_messages (name, email, subject, message) VALUES (%s, %s, %s, %s)",
            (name, email, subject, message),
        )
        conn.commit()
        cursor.close()
        conn.close()
    except mysql.connector.Error as err:
        print(f"[DB ERROR] {err}")
        flash("Could not save your message. Please try again later.", "error")
        return redirect(url_for("index") + "#contact")

    # Send email notification
    try:
        if app.config["MAIL_USERNAME"]:
            msg = MailMessage(
                subject=f"Portfolio Contact: {subject}",
                recipients=[app.config["ADMIN_EMAIL"]],
                body=f"Name: {name}\nEmail: {email}\nSubject: {subject}\n\nMessage:\n{message}",
            )
            mail.send(msg)
    except Exception as err:
        print(f"[MAIL ERROR] {err}")

    flash("Thank you! Your message has been sent successfully.", "success")
    return redirect(url_for("index") + "#contact")


@app.errorhandler(404)
def not_found(e):
    return render_template("index.html", projects=load_projects()), 404


@app.errorhandler(500)
def server_error(e):
    return render_template("index.html", projects=load_projects()), 500


if __name__ == "__main__":
    init_db()
    app.run(host="0.0.0.0", debug=app.config["DEBUG"], port=5000)
