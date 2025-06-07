from django.urls import path
from .views import UploadPDF, AskQuestion

urlpatterns = [
    path("upload-pdf/", UploadPDF.as_view()),
    path("ask/", AskQuestion.as_view()),
]
