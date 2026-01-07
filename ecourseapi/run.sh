
echo "🚀 Seeding database..."

python manage.py shell << 'EOF'
from courses.models import Category, Course, Lesson, User
from django.utils import timezone
import random

# ===== 1. TẠO USER =====
print("👤 Creating users...")

teacher, _ = User.objects.get_or_create(
    username="teacher1",
    defaults={
        "role": User.TEACHER,
        "email": "teacher1@gmail.com"
    }
)
teacher.set_password("123456")
teacher.save()

student, _ = User.objects.get_or_create(
    username="student1",
    defaults={
        "role": User.STUDENT,
        "email": "student1@gmail.com"
    }
)
student.set_password("123456")
student.save()

# ===== 2. TẠO CATEGORY =====
print("📂 Creating categories...")
categories = []
for i in range(1, 11):
    cat, _ = Category.objects.get_or_create(name=f"Category {i}")
    categories.append(cat)

# ===== 3. TẠO COURSE =====
print("📘 Creating courses...")
courses = []
for i in range(1, 21):
    course = Course.objects.create(
        subject=f"Course {i}",
        description=f"Description for course {i}",
        price=random.choice([0, 99, 199, 299]),
        category=random.choice(categories),
        teacher=teacher,
        created_date=timezone.now()
    )
    courses.append(course)

# ===== 4. TẠO LESSON =====
print("📚 Creating lessons...")
for i in range(1, 31):
    Lesson.objects.create(
        subject=f"Lesson {i}",
        content=f"<p>Content for lesson {i}</p>",
        course=random.choice(courses),
        created_date=timezone.now()
    )

print("✅ DONE! Database seeded successfully.")
EOF
