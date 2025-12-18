from rest_framework import viewsets, status
from rest_framework.response import Response
from .models import Project, ProjectImage
from .serializers import ProjectSerializer
from rest_framework.permissions import IsAuthenticatedOrReadOnly

class ProjectViewSet(viewsets.ModelViewSet):
    queryset = Project.objects.all().order_by('-created_at')
    serializer_class = ProjectSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

    def create(self, request, *args, **kwargs):
        try:
            title = request.data.get('title')
            description = request.data.get('description')
            project = Project.objects.create(title=title, description=description)
            images = request.FILES.getlist('uploaded_images')
            for image in images:
                ProjectImage.objects.create(project=project, image=image)
            serializer = self.get_serializer(project)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        except Exception as e:
            print(f"BŁĄD BACKENDU: {e}")
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)