FROM python:3.11

WORKDIR /app

COPY pyproject.toml poetry.lock /app/

RUN pip install poetry

COPY . /app

RUN poetry install

EXPOSE 8000

CMD ["poetry", "run", "uvicorn", "src.backend.main:app", "--host", "0.0.0.0", "--port", "8000"]