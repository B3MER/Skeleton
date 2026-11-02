FROM python:3.12-slim
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1
WORKDIR /app
RUN apt-get update && apt-get install -y --no-install-recommends\
    libpq5 \
    &&  rm -rf /var/lib/apt/lists/*

RUN pip install --no-cache-dir pipenv gunicorn

COPY Pipfile Pipfile.lock ./
RUN pipenv install --system --deploy

COPY . .
EXPOSE 8008

CMD ["daphne", "-b", "0.0.0.0", "-p", "8008", "core.asgi:application"]

    