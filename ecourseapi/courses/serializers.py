

from courses.models import Category, Course, Lesson, Tag, User, Comment, Receipt
from rest_framework import serializers




class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name']

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id','first_name','last_name','username','password','avatar']
        extra_kwargs = {
            'password': {
                'write_only': True,
            }
        }

    def create(self, validated_data):
        u = User(**validated_data)
        u.set_password(u.password)
        u.save()

        return u

    def to_representation(self, instance):
        data = super().to_representation(instance)

        if instance.avatar:
            data['avatar'] = instance.avatar.url

        return data

class CourseSerializer(serializers.ModelSerializer):
    teacher = UserSerializer(read_only=True)
    class Meta:
        model = Course
        fields = ['id', 'subject', 'created_date','image','category', 'price', 'teacher']


    def to_representation(self, instance):
        data = super().to_representation(instance)

        if instance.image:
            data['image'] = instance.image.url

        return data

class LessonSerializer(serializers.ModelSerializer):
    class Meta:
        model = Lesson
        fields = ['id', 'subject', 'created_date','course','image']

    def to_representation(self, instance):
        data = super().to_representation(instance)
        if instance.image:
            data['image'] = instance.image.url
        return data


class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = '__all__'



class LessonDetailsSerializer(LessonSerializer):
    tags = TagSerializer(many=True)

    class Meta:
        model = LessonSerializer.Meta.model
        fields = LessonSerializer.Meta.fields + ['tags','content']



class CommentSerializer(serializers.ModelSerializer):
    def to_representation(self, instance):
        data = super().to_representation(instance)

        data['user'] = UserSerializer(instance.user).data

        return data

    class Meta:
        model = Comment
        fields = ['id','content','created_date','user','lesson']
        extra_kwargs = {
            'lesson': {
                'write_only': True,
            }
        }

class ReceiptSerializer(serializers.ModelSerializer):
    class Meta:
        model = Receipt
        fields = ['id','amount','payment_method','created_date']



