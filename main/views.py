from django.contrib import messages
from django.shortcuts import render, get_object_or_404, redirect
from django.contrib.auth.decorators import login_required
from django.contrib.auth import authenticate, login
import csv, io
from .models import Graduate, Account, Batch, GraduateTracerForm
from Crypto.PublicKey import RSA
import qrcode
import base64
from io import BytesIO
from django.core.mail import send_mail
from collections import defaultdict
from django.db.models import Count, Q
from django.contrib.auth.models import User
from django.contrib.auth.hashers import make_password

def gts(request, graduate_id):
    graduate = get_object_or_404(Graduate, id=graduate_id)

    return render(request, 'gts.html', {
        'graduate': graduate
    })

def register_form(request, graduate_id):
    graduate = get_object_or_404(Graduate, id=graduate_id)

    if request.method == 'POST':
        tracer_form = GraduateTracerForm.objects.create(
            graduate=graduate,
            full_name=request.POST.get('full_name'),
            address=request.POST.get('address'),
            mobile_number=request.POST.get('mobile_number'),
            civil_status=request.POST.get('civil_status'),
            birthday=request.POST.get('birthday'),
            region=request.POST.get('region'),
            sex=request.POST.get('sex'),
            province=request.POST.get('province'),
            residence_location=request.POST.get('residence_location'),
            degree=request.POST.get('degree'),
            specialization=request.POST.get('specialization'),
            college_name=request.POST.get('college_name'),
            year_graduated=request.POST.get('year_graduated'),
            honors=request.POST.get('honors'),
            exam_passed=request.POST.get('exam_passed'),
            exam_date=request.POST.get('exam_date') or None,
            exam_rating=request.POST.get('exam_rating'),
            undergrad_reasons=",".join(request.POST.getlist('undergrad_reasons')),
            grad_reasons=",".join(request.POST.getlist('grad_reasons')),
            grad_reasons_other=request.POST.get('grad_reasons_other', ''),
            trainings=request.POST.get('trainings'),
            advance_reason=request.POST.get('advance_reason'),
            employment_status=request.POST.get('employment_status'),
            unemployed_reasons=",".join(request.POST.getlist('unemployed_reasons')),
            occupation=request.POST.get('occupation'),
            business_line=request.POST.get('business_line'),
            work_location=",".join(request.POST.getlist('work_location')),
            first_job=request.POST.get('first_job'),
            stay_reasons=",".join(request.POST.getlist('stay_reasons')),
            job_course_relation=request.POST.get('job_course_relation'),
            job_finding_time=request.POST.get('job_finding_time'),
            job_accept_reasons=",".join(request.POST.getlist('job_accept_reasons[]')),
            job_change_reasons=",".join(request.POST.getlist('job_change_reasons[]')),
            first_job_duration=request.POST.get('first_job_duration'),
            first_job_position=request.POST.get('first_job_position'),
            current_job_position=request.POST.get('current_job_position'),
            current_employer_name=request.POST.get('current_employer_name'),
            current_employer_address=request.POST.get('current_employer_address'),
            current_supervisor_name=request.POST.get('current_supervisor_name'),
            current_employer_contact=request.POST.get('current_employer_contact'),
            initial_salary=request.POST.get('initial_salary'),
            curriculum_relevance=request.POST.get('curriculum_relevance'),
            college_competencies=",".join(request.POST.getlist('college_competencies[]')),
            other_skills_specified=request.POST.get('other_skills_specified'),
            data_privacy='data_privacy' in request.POST
        )

        # Send summary email
        summary = f"""
Dear {graduate.first_name},

Your Graduate Tracer Form has been successfully submitted.

Summary:
- Full Name: {tracer_form.full_name}
- Degree: {tracer_form.degree}
- Year Graduated: {tracer_form.year_graduated}
- Employment Status: {tracer_form.employment_status}
- First Job: {tracer_form.first_job}
- Salary Range: {tracer_form.initial_salary}
        """

        send_mail(
            subject="eYearbook Tracer Form Submitted",
            message=summary,
            from_email=None,
            recipient_list=[graduate.email],
            fail_silently=False,
        )

        return redirect('thank_you')

    return render(request, 'gts.html', {'graduate': graduate})

def login_view(request):
    if request.method == 'POST':
        username = request.POST.get('username')  # Changed from 'email' to 'username'
        password = request.POST.get('password')

        user = authenticate(request, username=username, password=password)
        if user is not None:
            login(request, user)
            return redirect('dashboard')
        else:
            messages.error(request, 'Invalid username or password.')

    return render(request, 'login.html')

@login_required

def dashboard_view(request):
    graduates = Graduate.objects.all()
    total_graduates = graduates.count()
    total_submitted = graduates.filter(tracer_forms__isnull=False).distinct().count()
    total_not_submitted = total_graduates - total_submitted

    # Chart data preparation
    course_stats = graduates.values('course').annotate(
        submitted=Count('id', filter=Q(tracer_forms__isnull=False)),
        not_submitted=Count('id', filter=Q(tracer_forms__isnull=True))
    )

    chart_labels = [item['course'] for item in course_stats]
    chart_submitted = [item['submitted'] for item in course_stats]
    chart_not_submitted = [item['not_submitted'] for item in course_stats]

    return render(request, 'dashboard.html', {
        'graduates': graduates,
        'total_graduates': total_graduates,
        'total_submitted': total_submitted,
        'total_not_submitted': total_not_submitted,
        'chart_labels': chart_labels,
        'chart_submitted': chart_submitted,
        'chart_not_submitted': chart_not_submitted,
    })

def configure_view(request):
    if request.method == 'POST':
        from_year = request.POST.get('from_year')
        to_year = request.POST.get('to_year')
        batch_type = request.POST.get('batch_type')
        if from_year and to_year and batch_type:
            Batch.objects.create(
                from_year=from_year,
                to_year=to_year,
                batch_type=batch_type
            )
            return redirect('configure')  # make sure this matches your URL name
    batches = Batch.objects.all()
    return render(request, 'configure.html', {'batches': batches})

def accounts_view(request):
    accounts = Account.objects.select_related('graduate').all()

    for account in accounts:
        # Embed full URL in QR code
        graduate_id = account.graduate.id
        url = f"http://127.0.0.1:8000/gts/{graduate_id}"
        qr = qrcode.make(url)

        buffer = BytesIO()
        qr.save(buffer, format="PNG")
        qr_base64 = base64.b64encode(buffer.getvalue()).decode()
        account.qr_image = f"data:image/png;base64,{qr_base64}"

    return render(request, 'accounts.html', {'accounts': accounts})

def import_accounts_view(request):
    if request.method == 'POST' and request.FILES.get('csv_file'):
        csv_file = request.FILES['csv_file']
        if not csv_file.name.endswith('.csv'):
            messages.error(request, 'Please upload a valid CSV file.')
            return redirect('accounts')

        data_set = csv_file.read().decode('UTF-8')
        io_string = io.StringIO(data_set)
        next(io_string)  # Skip header row

        for row in csv.reader(io_string, delimiter=','):
            try:
                first, middle, last, email, contact, address, course, ambition, batch_id = row
                batch = Batch.objects.get(id=batch_id)

                graduate = Graduate.objects.create(
                    first_name=first.strip(),
                    middle_name=middle.strip(),
                    last_name=last.strip(),
                    email=email.strip(),
                    contact=contact.strip(),
                    address=address.strip(),
                    course=course.strip(),
                    ambition=ambition.strip(),
                    batch=batch
                )

                key = RSA.generate(2048)
                private_key = key.export_key().decode()
                public_key = key.publickey().export_key().decode()

                Account.objects.create(
                    graduate=graduate,
                    public_key=public_key,
                    private_key=private_key
                )

            except Exception as e:
                messages.error(request, f"Error importing row: {row} – {e}")
                continue

        messages.success(request, "CSV file imported successfully.")
        return redirect('account_list')

def add_account_view(request):
    batches = Batch.objects.all()
    
    # Prevent form usage if no batch exists
    if not batches.exists():
        messages.warning(request, "Please add a batch first before creating student records.")
        return redirect('configure')  # Or any relevant redirect

    if request.method == 'POST':
        first_name = request.POST.get('first_name')
        middle_name = request.POST.get('middle_name', '')
        last_name = request.POST.get('last_name')
        email = request.POST.get('email')
        contact = request.POST.get('contact')
        address = request.POST.get('address')
        course = request.POST.get('course')
        ambition = request.POST.get('ambition', '')
        batch_id = request.POST.get('batch_id')
        photo = request.FILES.get('photo', None)

        try:
            batch = Batch.objects.get(id=batch_id)

            # Save Graduate first
            graduate = Graduate.objects.create(
                first_name=first_name,
                middle_name=middle_name,
                last_name=last_name,
                email=email,
                contact=contact,
                address=address,
                course=course,
                ambition=ambition,
                batch=batch,
                photo=photo
            )

            # Generate RSA Keypair
            key = RSA.generate(2048)
            private_key = key.export_key().decode()
            public_key = key.publickey().export_key().decode()

            # Create Account
            Account.objects.create(
                graduate=graduate,
                public_key=public_key,
                private_key=private_key
            )

            messages.success(request, "Student account successfully added.")
            return redirect('account_list')

        except Exception as e:
            messages.error(request, f"Error: {str(e)}")

    return render(request, 'accounts/add_account.html', {'batches': batches})

def alumni_tracker_view(request):
    graduates = Graduate.objects.all()
    return render(request, 'tracker/alumni.html', {'graduates': graduates})

def view_tracer_form(request, graduate_id):
    graduate = get_object_or_404(Graduate, id=graduate_id)
    tracer = GraduateTracerForm.objects.filter(graduate=graduate).first()

    return render(request, 'tracker/view_tracer_form.html', {
        'graduate': graduate,
        'tracer': tracer
    })

def user_management_view(request):
    if request.method == 'POST':
        username = request.POST.get('username')
        email = request.POST.get('email')
        password = request.POST.get('password')

        if User.objects.filter(username=username).exists():
            messages.error(request, "Username already exists.")
        else:
            User.objects.create(
                username=username,
                email=email,
                password=make_password(password),
                is_staff=True,
                is_superuser=False
            )
            messages.success(request, "Admin account created successfully.")
        return redirect('user_management')

    admins = User.objects.filter(is_staff=True).order_by('-date_joined')
    return render(request, 'user/index.html', {'admins': admins})