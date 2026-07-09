FROM python:3.11-slim

WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .

ENV DATABASE_URL=sqlite:///smartshop.db
EXPOSE 5001
CMD ["gunicorn", "app:create_app()", "--bind", "0.0.0.0:5001"]
