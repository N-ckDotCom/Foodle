FROM rasa/rasa

COPY ./models /app/models
COPY ./actions /app/actions

CMD ["run", "-m", "models", "--enable-api", "--cors", "*", "--endpoints", "endpoints.yml","-vv"] 
