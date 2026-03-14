# Portfolio - Suraj Gond

Full-stack developer portfolio built with Flask, Tailwind CSS, and MySQL.

**Live:** [surajgond.pythonanywhere.com](https://surajgond.pythonanywhere.com)

## Tech Stack

- Python, Flask, Flask-Mail
- MySQL
- Tailwind CSS v4, Vanilla JS
- Deployed on PythonAnywhere

## Setup

1. Clone the repo and create a virtual environment:
```
git clone https://github.com/Suraj-Gond/Portfolio.git
```
```
cd Portfolio
```
```
python -m venv venv
```
```
venv\Scripts\activate   # Windows
```
```
pip install -r requirements.txt
```

2. Copy `.env.example` to `.env` and fill in your credentials:
```bash
cp .env.example .env
```

3. Generate a secret key:
```bash
python -c "import secrets; print(secrets.token_hex(32))"
```

4. Run the app:
```bash
python app.py
```

The app will be available at `http://localhost:5000`.

### Database Setup (Local/XAMPP)

For local development,use XAMPP to host MySQL database:
1. Open XAMPP Control Panel and start **Apache** and **MySQL**.
2. Click the **Admin** button next to MySQL to open phpMyAdmin in browser.
3. Create a new database named `your_database_name` (matching your `.env` file).
4. Click on new database, go to the **SQL** tab, and run the following command to create the contact table:
```sql
CREATE TABLE IF NOT EXISTS contact_messages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(120) NOT NULL,
    subject VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```
5. Click **Go** to execute the query. Your local database is now ready!

*note: if you are using any other local MySQL server, then follow the same steps as above.*

*note: Creating table is optional, as python backend will create the table if it doesn't exist.*

## Environment Variables

See [.env.example](.env.example) for all required variables:

| Variable | Description |
|---|---|
| `SECRET_KEY` | Flask session secret (use `secrets.token_hex(32)`) |
| `FLASK_DEBUG` | `True` for development, `False` for production |
| `DB_HOST` | MySQL host |
| `DB_PORT` | MySQL port |
| `DB_USER` | MySQL username |
| `DB_PASSWORD` | MySQL password |
| `DB_NAME` | MySQL database name |
| `MAIL_SERVER` | SMTP server (e.g. `smtp.gmail.com`) |
| `MAIL_PORT` | SMTP port (e.g. `587`) |
| `MAIL_USE_TLS` | `True` for TLS |
| `MAIL_USERNAME` | Email address for sending |
| `MAIL_PASSWORD` | Email app password |
| `MAIL_DEFAULT_SENDER` | Default sender address |
| `ADMIN_EMAIL` | Receives contact form submissions |

## Project Structure

```
├── app.py              # Flask application
├── config.py           # Config from environment
├── data/
│   └── projects.json   # Project data
├── static/
│   ├── css/
│   │   └── style.css   # Compiled Tailwind CSS
│   ├── js/
│   │   ├── main.js     # UI interactions
│   │   └── theme.js    # Dark/light mode
│   └── thumbnails/     # Project thumbnails
├── templates/
│   ├── base.html       # Base template
│   └── index.html      # Main page
└── requirements.txt
```
