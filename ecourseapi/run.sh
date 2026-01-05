echo "=== Chèn dữ liệu mẫu ==="

python manage.py shell <<EOF
from courses.models import Category, Course, Tag, Lesson

# ===== CATEGORY =====
c1, _ = Category.objects.get_or_create(name='Software Engineering')
c2, _ = Category.objects.get_or_create(name='Artificial Intelligence')
c3, _ = Category.objects.get_or_create(name='Data Sciences')

# ===== COURSE =====
co1, _ = Course.objects.get_or_create(
    subject='Introduction to SE',
    category=c1,
    defaults={
        'description': 'demo',

    }
)

co2, _ = Course.objects.get_or_create(
    subject='Software Testing',
    category=c1,
    defaults={
        'description': 'demo',

    }
)

co3, _ = Course.objects.get_or_create(
    subject='Introduction to AI',
    category=c2,
    defaults={
        'description': 'demo',

    }
)

co4, _ = Course.objects.get_or_create(
    subject='Machine Learning',
    category=c2,
    defaults={
        'description': 'demo',

    }
)

co5, _ = Course.objects.get_or_create(
    subject='Deep Learning',
    category=c2,
    defaults={
        'description': 'demo',

    }
)

co6, _ = Course.objects.get_or_create(
    subject='Python Programming',
    category=c3,
    defaults={
        'description': 'demo',

    }
)

# ===== TAG =====
t1, _ = Tag.objects.get_or_create(name='techniques')
t2, _ = Tag.objects.get_or_create(name='software')
t3, _ = Tag.objects.get_or_create(name='programming')

# ===== LESSON =====
l1, _ = Lesson.objects.get_or_create(
    subject='SE Overview',
    course=co1,
    defaults={
        'content': 'Demo',

    }
)
l1.tags.set([t1, t2])

l2, _ = Lesson.objects.get_or_create(
    subject='Software Analysis',
    course=co1,
    defaults={
        'content': 'Demo',

    }
)
l2.tags.set([t2, t3])

l3, _ = Lesson.objects.get_or_create(
    subject='Software Design',
    course=co1,
    defaults={
        'content': 'Demo',

    }
)
l3.tags.set([t1, t2, t3])

l4, _ = Lesson.objects.get_or_create(
    subject='Black-box Testing',
    course=co2,
    defaults={
        'content': 'Demo',

    }
)

l5, _ = Lesson.objects.get_or_create(
    subject='White-box Testing',
    course=co2,
    defaults={
        'content': 'Demo',

    }
)

print("Insert sample data successfully!")
EOF
