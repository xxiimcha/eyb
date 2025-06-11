import csv
import io
import qrcode
import base64
from io import BytesIO
from collections import defaultdict

from django.shortcuts import render, get_object_or_404, redirect
from django.contrib import messages
from django.db.models import Count, Q
from django.core.mail import send_mail, EmailMessage
from django.template.loader import render_to_string
from django.utils.html import strip_tags
from django.conf import settings

from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.contrib.auth.hashers import make_password
from django.contrib.auth.models import User

from Crypto.PublicKey import RSA

from .models import Graduate, Account, Batch, GraduateTracerForm

def normalize_key(key):
    return ''.join(key.strip().split())

def student_login_view(request):
    error = None

    if request.method == 'POST':
        pasted_key = request.POST.get('private_key', '').strip()

        if not pasted_key:
            error = "Please paste your RSA private key."
        else:
            pasted_clean = normalize_key(pasted_key)
            for account in Account.objects.select_related('graduate'):
                if normalize_key(account.private_key) == pasted_clean:
                    request.session['account_id'] = account.id
                    request.session['graduate_id'] = account.graduate.id
                    return redirect('student_profile')

            error = "Invalid RSA private key."

    return render(request, 'login.html', {'error': error})

def student_profile_page(request):
    graduate_id = request.session.get('graduate_id')
    if not graduate_id:
        return redirect('student_login')

    graduate = Graduate.objects.get(id=graduate_id)
    batchmates = Graduate.objects.filter(batch=graduate.batch)

    # Group all batchmates (including the graduate) by course
    course_groups = defaultdict(list)
    for g in batchmates:
        course_groups[g.course].append(g)

    return render(request, 'profile_page.html', {
        'graduate': graduate,
        'course_groups': dict(course_groups)
    })


def print_yearbook_view(request):
    graduate_id = request.session.get('graduate_id')
    if not graduate_id:
        return redirect('student_login')

    graduate = Graduate.objects.get(id=graduate_id)
    batchmates = Graduate.objects.filter(batch=graduate.batch)

    course_groups = defaultdict(list)
    for g in batchmates:
        course_groups[g.course].append(g)

    return render(request, 'yearbook/print_yearbook.html', {
        'graduate': graduate,
        'course_groups': dict(course_groups)
    })

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

def update_account(request):
    if request.method == 'POST':
        user = request.user
        full_name = request.POST.get('full_name', '').strip()
        password = request.POST.get('password', '').strip()

        if full_name:
            name_parts = full_name.split()
            user.first_name = name_parts[0]
            user.last_name = ' '.join(name_parts[1:]) if len(name_parts) > 1 else ''

        if password:
            user.set_password(password)

        user.save()
        messages.success(request, 'Account updated successfully.')

        # Re-login is required if password is changed
        from django.contrib.auth import update_session_auth_hash
        update_session_auth_hash(request, user)

    return redirect('dashboard')  # or the current page

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

def edit_batch(request, id):
    batch = get_object_or_404(Batch, id=id)
    
    if request.method == 'POST':
        from_year = request.POST.get('from_year')
        to_year = request.POST.get('to_year')
        batch_type = request.POST.get('batch_type')

        batch.from_year = from_year
        batch.to_year = to_year
        batch.batch_type = batch_type
        batch.save()

        messages.success(request, 'Batch updated successfully.')
        return redirect('configure')  # replace with your config page URL name

    return redirect('configure')

def delete_batch(request, id):
    batch = get_object_or_404(Batch, id=id)

    if request.method == 'POST':
        batch.delete()
        messages.success(request, 'Batch deleted successfully.')

    return redirect('configure')


def accounts_view(request):
    # Get filter parameters from the request
    course = request.GET.get('course')
    batch_id = request.GET.get('batch')
    search = request.GET.get('search')

    # Initial queryset
    accounts = Account.objects.select_related('graduate').all()

    # Apply filters
    if course:
        accounts = accounts.filter(graduate__course=course)
    if batch_id:
        accounts = accounts.filter(graduate__batch_id=batch_id)
    if search:
        accounts = accounts.filter(
            Q(graduate__first_name__icontains=search) |
            Q(graduate__last_name__icontains=search)
        )

    # Generate QR code for each account
    for account in accounts:
        graduate_id = account.graduate.id
        url = f"https://eyb.onrender.com/gts/{graduate_id}"
        qr = qrcode.make(url)
        buffer = BytesIO()
        qr.save(buffer, format="PNG")
        qr_base64 = base64.b64encode(buffer.getvalue()).decode()
        account.qr_image = f"data:image/png;base64,{qr_base64}"

    # For dropdown filter options
    courses = Account.objects.values_list('graduate__course', flat=True).distinct().order_by('graduate__course')
    batches = Batch.objects.all().order_by('-from_year')

    return render(request, 'accounts.html', {
        'accounts': accounts,
        'courses': courses,
        'batches': batches,
    })

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

                # Generate QR code for public key
                url = f"https://eyb.onrender.com/gts/{graduate.id}"
                qr = qrcode.make(url)
                buffer = BytesIO()
                qr.save(buffer, format="PNG")
                qr_base64 = base64.b64encode(buffer.getvalue()).decode()

                subject = 'Your eYearbook Account Credentials'
                html_message = render_to_string('emails/account_credentials.html', {
                    'graduate': graduate,
                    'public_key': public_key,
                    'private_key': private_key,
                    'qr_code': qr_base64,
                    'access_url': url  # Pass the direct URL to the template
                })
                plain_message = strip_tags(html_message)

                send_mail(
                    subject,
                    plain_message,
                    settings.DEFAULT_FROM_EMAIL,
                    [graduate.email],
                    html_message=html_message,
                    fail_silently=False
                )

            except Exception as e:
                messages.error(request, f"Error importing row: {row} – {e}")
                continue

        messages.success(request, "CSV file imported successfully.")
        return redirect('account_list')

def add_account_view(request):
    batches = Batch.objects.all()

    if not batches.exists():
        messages.warning(request, "Please add a batch first before creating student records.")
        return redirect('configure')

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

            key = RSA.generate(2048)
            private_key = key.export_key().decode()
            public_key = key.publickey().export_key().decode()

            Account.objects.create(
                graduate=graduate,
                public_key=public_key,
                private_key=private_key
            )

            # Generate link to graduate's GTS form
            url = f"https://eyb.onrender.com/gts/{graduate.id}"

            # Generate QR code for the URL
            qr = qrcode.make(url)
            buffer = BytesIO()
            qr.save(buffer, format="PNG")
            qr_base64 = base64.b64encode(buffer.getvalue()).decode()

            # Email content
            subject = 'Your eYearbook Account Credentials'
            html_message = render_to_string('emails/account_credentials.html', {
                'graduate': graduate,
                'public_key': public_key,
                'private_key': private_key,
                'qr_code': qr_base64,
                'access_url': url  # Include URL in context
            })
            plain_message = strip_tags(html_message)

            send_mail(
                subject,
                plain_message,
                settings.DEFAULT_FROM_EMAIL,
                [graduate.email],
                html_message=html_message,
                fail_silently=False
            )

            messages.success(request, "Student account successfully added.")
            return redirect('account_list')

        except Exception as e:
            messages.error(request, f"Error: {str(e)}")

    return render(request, 'accounts/add_account.html', {'batches': batches})

def delete_account_view(request, id):
    if request.method == 'POST':
        account = get_object_or_404(Account, id=id)
        graduate = account.graduate
        account.delete()
        graduate.delete()
        messages.success(request, 'Account and associated graduate deleted successfully.')
    return redirect('account_list')


def alumni_tracker_view(request):
    course = request.GET.get('course')
    batch_id = request.GET.get('batch')
    status = request.GET.get('status')
    search = request.GET.get('search')

    graduates = Graduate.objects.select_related('batch').prefetch_related('tracer_forms').all()

    # Apply filters
    if course:
        graduates = graduates.filter(course=course)
    if batch_id:
        graduates = graduates.filter(batch_id=batch_id)
    if search:
        graduates = graduates.filter(
            Q(first_name__icontains=search) |
            Q(last_name__icontains=search) |
            Q(middle_name__icontains=search)
        )
    if status == 'submitted':
        graduates = [g for g in graduates if g.tracer_forms.exists()]
    elif status == 'not_submitted':
        graduates = [g for g in graduates if not g.tracer_forms.exists()]

    # For filter dropdowns
    courses = Graduate.objects.values_list('course', flat=True).distinct().order_by('course')
    batches = Batch.objects.all().order_by('-from_year')

    return render(request, 'tracker/alumni.html', {
        'graduates': graduates,
        'courses': courses,
        'batches': batches,
    })

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

def analytics_view(request):
    selected_batch_id = request.GET.get('batch_id')
    all_batches = Batch.objects.all().order_by('from_year')

    if selected_batch_id:
        graduates = Graduate.objects.filter(batch_id=selected_batch_id)
        selected_batch_id = int(selected_batch_id)
    else:
        graduates = Graduate.objects.all()
        selected_batch_id = None

    total_graduates = graduates.count()
    total_courses = graduates.values('course').distinct().count()
    total_batches = all_batches.count()

    employed_count = 0
    submitted_count = 0

    for grad in graduates:
        tracer = grad.tracer_forms.first()
        if tracer:
            submitted_count += 1
            if tracer.employment_status == 'employed':
                employed_count += 1

    not_submitted_count = total_graduates - submitted_count

    # Chart: Graduates per batch
    chart_labels = []
    chart_data = []

    filtered_batches = all_batches if not selected_batch_id else all_batches.filter(id=selected_batch_id)

    for batch in filtered_batches:
        chart_labels.append(f"{batch.from_year}-{batch.to_year}")
        chart_data.append(graduates.filter(batch=batch).count())

    return render(request, 'analytics.html', {
        'total_graduates': total_graduates,
        'total_courses': total_courses,
        'total_batches': total_batches,
        'employed_count': employed_count,
        'submitted_count': submitted_count,
        'not_submitted_count': not_submitted_count,
        'chart_labels': chart_labels,
        'chart_data': chart_data,
        'all_batches': all_batches,
        'selected_batch_id': selected_batch_id,
    })