from rest_framework import serializers
from .models import Project, ProjectImage

class ProjectImageSerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField()

    class Meta:
        model = ProjectImage
        fields = ['id', 'image']

    def get_image(self, obj):
        if obj.image:
            return obj.image.url
        return None

class ProjectSerializer(serializers.ModelSerializer):
    images = ProjectImageSerializer(many=True, read_only=True)

    class Meta:
        model = Project
        fields = ['id', 'title', 'description', 'images', 'created_at']