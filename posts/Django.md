---
title: "Notes on Django"
date: "2025-05-12"
excerpt: ""
tags: ["Notes", "Tech"]
author: "Ed"
---

## Intro

arch: MVT, Model-View-Template

Should work in a python virtual environment.

### Workflow

1. Create a project: `django-admin startproject project-name`
2. Create applications: `python3 manage.py startapp app-name`
3. Register the created apps: add the apps' config objects to the `INSTALLED_APPS` list in settings.py
4. Specify the db
5. Other settings: `TIME_ZONE`, `SECRET_KEY`, `DEBUG`, etc
6. Hook up the URL mapper
7. Run db migrations: `python3 manage.py makemigrations`, `python3 manage.py migrate`
   Run these commands every time the models change in a way that will affect the structure of the data that needs to be stored.
8. Run the website: `python3 manage.py runserver`

## Models

Django web apps access and manage data through Python objects referred to as models. Models define the structure of stored data. i.e. models handle all the dirty work of communicating with the db for u.

1. Design models abstractly: UML association diagram
2. Define models: usually defined in an app's `models.py` file as subclasses of `django.db.models.Model`, and can include:
   - fields: The field name is used to refer to it in queries and templates. Fields also have a label, which is specified using the `verbose_name` argument (with a default value of `None`). If `verbose_name` is not set, the label is created from the field name by replacing any underscores with a space, and capitalizing the first letter (for example, the field `my_field_name` would have a default label of *My field name* when used in forms).
   - methods
   - metadata
3. Manage models:
   - Create records: `record = Model(para=what)`, `record.save()`
   - Modify records: use dot syntax, just like classes in c++
   - Search for records: we can get all records for a model as a `QuerySet`, and then filter it, see [Making queries](https://docs.djangoproject.com/en/4.0/topics/db/queries/)

### ForeignKey

One-to-many relationship between models.

`BookInstance`s are not created from `Book`s, although you can create a `Book` from a `BookInstance` — this is the nature of the `ForeignKey` field.

Since you only declare the ForeignKey field in the "many" side of the relationship, the "one" side doesn't have any field to get in touch with the "many" side. An interesting functionality is that Django allows you to reverse lookup the "many" side from the "one" side using the appropriately named func `<many-side-model-name>_set`.

## Admin site

1. Register models: modify admin.py like `admin.site.register(model-name)`
2. Create a superuser: `python3 manage.py createsuperuser`
3. Log in and use the admin site

Advanced config:

- Comment out the original model registration
- Register a ModelAdmin class: `@admin.register(ModelName)`
- Create admin models: `class ModelNameAdmin(admin.ModelAdmin)`
- Configure list views: `list_display`
- Configure list filters: `list_filter`
- Control which fields are displayed and laid out: `fields`, `exclude`
  The `fields` attribute lists just those fields that are to be displayed on the form, in order. Fields are displayed vertically by default, but will display horizontally if you further group them in a tuple.
- Section the detail view: `fieldsets`
- Inline editing of associated records:

A complete reference of all the admin site customization choices in [The Django Admin site](https://docs.djangoproject.com/en/4.0/ref/contrib/admin/) (Django Docs).

Can't directly specify the `genre` field in `list_display` because it is a `ManyToManyField` (Django prevents this because there would be a large database access "cost" in doing so). Instead we'll define a `display_genre` function to get the information as a string.

## URL mappers

Whenever Django encounters the import function `django.urls.include()`, it splits the URL string at the designated end character and sends the remaining substring to the included *URLconf* module for further processing.

## View functions

A view is a function that processes an HTTP request, fetches the required data from the database, renders the data in an HTML page using an HTML template, and then returns the generated HTML in an HTTP response to display the page to the user.

There are two(for now) kinds of view funcs:

1. Function-based view
2. Class-based view

### Function-based view

```python
# urls.py
urlpattern += [
	path('example/', views.example, name='example')
]
```

```python
# views.py
from django.shortcuts import render
from .models import <model_name>
def example(request):
	# define some variables to be conveyed to templates
	context = {
		# variables defined above
	}
	return render(request, '<template_name>', context=context)
```

### Class-based view

For Django class-based views we access an appropriate view function by calling the class method `as_view()`. This does all the work of creating an instance of the class, and making sure that the right handler methods are called for incoming HTTP requests.

```python
# urls.py
urlpattern += [
	path('example/', views.example.as_view(), name='example')
]
```

```python
# views.py
from django.views import generic
class example(generic.ListView):
	model = example
```

That's it! The generic view will query the database to get all records for the specified model and then render a template located at `./templates/<app_name>/<model_name>_list.html`. Within the template you can access the list with the template variable named `object_list` or generically `<model_name>_list`, either will work.

#### Overriding methods in class-based views

We might also override `get_context_data()` in order to pass additional context variables to the template (e.g. the list of books is passed by default). The fragment below shows how to add a variable named "`some_data`" to the context (it would then be available as a template variable).

```python
class BookListView(generic.ListView):
    model = Book

    def get_context_data(self, **kwargs):
        # Call the base implementation first to get the context
        context = super(BookListView, self).get_context_data(**kwargs)
        # Create any data and add it to the context
        context['some_data'] = 'This is just some data'
        return context
```

When doing this it is important to follow the pattern used above:

- First get the existing context from our superclass.
- Then add your new context information.
- Then return the new (updated) context.

#### Ordered/Unordered object list in template

If you don't define an order (on your class-based view or model), you will also see errors from the development server like `/UnorderedObjectListWarning: Pagination may yield inconsistent results with an unordered object_list`.

That happens because the [paginator object](https://docs.djangoproject.com/en/4.0/topics/pagination/#paginator-objects) expects to see some ORDER BY being executed on your underlying database. Without it, it can't be sure the records being returned are actually in the right order!

Since you haven't learned about pagination and can't use `sort_by()` and pass a parameter you will have to choose between three choices:

1.  Add a `ordering` inside a `class Meta` declaration on your model.
2.  Add a `queryset` attribute in your custom class-based view, specifying an `order_by()`.
3.  Adding a `get_queryset` method to your custom class-based view and also specify the `order_by()`.

## Templates

A template is a text file that defines the structure or layout of a file (such as an HTML page), it uses placeholders to represent actual content.

Extending templates: declare a base template named base_generic.html and then extend it using _template tags_ and _placeholders_.

> *Template tags* are functions that you can use in a template to loop through lists, perform conditional operations based on the value of a variable, and so on. In addition to template tags, the template syntax allows you to reference variables that are passed into the template from the view, and use *template filters* to format variables (for example, to convert a string to lower case).

You can easily recognize template variables and template tags (functions) - variables are enclosed in double braces (`{{ num_books }}`), and tags are enclosed in single braces with percentage signs (`{% extends "base_generic.html" %}`).

## Sessions

All communication between web browsers and servers is via [HTTP](https://developer.mozilla.org/en-US/docs/Glossary/HTTP), which is *stateless*. The fact that the protocol is stateless means that messages between the client and server are completely independent of each other — there is no notion of "sequence" or behavior based on previous messages. As a result, if you want to have a site that keeps track of the ongoing relationships with a client, you need to implement that yourself.

Sessions are the mechanism used by Django (and most of the Internet) for keeping track of the "state" between the site and a particular browser. Sessions allow you to store arbitrary data per browser, and have this data available to the site whenever the browser connects. Individual data items associated with the session are then referenced by a "key", which is used both to store and retrieve the data.

### Saving session data

```python
# This is detected as an update to the session, so session data is saved.
request.session['my_car'] = 'mini'
```

```python
# Session object not directly modified, only data within the session. Session changes not saved!
request.session['my_car']['wheels'] = 'alloy'

# Set session as modified to force data updates/cookie to be saved.
request.session.modified = True
```

You can change the behavior so the site will update the database/send cookie on every request by adding `SESSION_SAVE_EVERY_REQUEST = True` into your project settings `settings.py`.

## Authentication & Authorization

### Workflow

1. Enable authentication
2. Create users and groups
3. Set up authentication views
4. Prepare associate templates
5. Test against authenticated users:
   - templates: `{% if user.is_authenticated %}`
   - func-based views: `@login_required`
   - class-based views: `class MyView(LoginRequiredMixin, GenericView)`

### Permissions

Permissions are associated with models and define the operations that can be performed on a model instance by a user who has the permission. By default, Django automatically gives *add*, *change*, and *delete* permissions to all models, which allow users with the permissions to perform the associated actions via the admin site. You can define your own permissions to models and grant them to specific users. You can also change the permissions associated with different instances of the same model.

Defining permissions is done on the model "`class Meta`" section, using the `permissions` field. You can specify as many permissions as you need in a tuple, each permission itself being defined in a nested tuple containing the permission name and permission display value. For example, we might define a permission to allow a user to mark that a book has been returned as shown:

```python
class BookInstance(models.Model):
    # …
    class Meta:
        # …
        permissions = (("can_mark_returned", "Set book as returned"),)
```

The current user's permissions are stored in a template variable called `{{ perms }}`. You can check whether the current user has a particular permission using the specific variable name within the associated Django "app" — e.g. `{{ perms.catalog.can_mark_returned }}` will be `True` if the user has this permission, and `False` otherwise:

```html
{% if perms.catalog.can_mark_returned %}
<!-- We can mark a BookInstance as returned. -->
<!-- Perhaps add link to a "book return" view here. -->
{% endif %}
```

Permissions can be tested in function view using the `permission_required` decorator or in a class-based view using the `PermissionRequiredMixin`. The pattern are the same as for login authentication, though of course, you might reasonably have to add multiple permissions:

```python
from django.contrib.auth.decorators import permission_required

@permission_required('catalog.can_mark_returned')
@permission_required('catalog.can_edit')
def my_view(request):
    # …
```

```python
from django.contrib.auth.mixins import PermissionRequiredMixin

class MyView(PermissionRequiredMixin, View):
    permission_required = 'catalog.can_mark_returned'
    # Or multiple permissions
    permission_required = ('catalog.can_mark_returned', 'catalog.can_edit')
```

There is a small default difference in the behavior above. By **default** for a logged-in user with a permission violation:

- `@permission_required` redirects to login screen (HTTP Status 302).
- `PermissionRequiredMixin` returns 403 (HTTP Status Forbidden).

Normally you will want the `PermissionRequiredMixin` behavior: return 403 if a user is logged in but does not have the correct permission. To do this for a function view use `@login_required` and `@permission_required` with `raise_exception=True` as shown:

```python
from django.contrib.auth.decorators import login_required, permission_required

@login_required
@permission_required('catalog.can_mark_returned', raise_exception=True)
def my_view(request):
    # …
```

## Forms

Django's form handling uses all of the same techniques that we learned about in previous tutorials (for displaying information about our models): the view gets a request, performs any actions required including reading data from the models, then generates and returns an HTML page (from a template, into which we pass a *context* containing the data to be displayed). What makes things more complicated is that the server also needs to be able to process data provided by the user, and redisplay the page if there are any errors.

### Workflow

![[Django-form-procssing-flowchart.png]]

1.  Display the default form the first time it is requested by the user.
    - The form may contain blank fields if you're creating a new record, or it may be pre-populated with initial values (for example, if you are changing a record, or have useful default initial values).
    - The form is referred to as *unbound* at this point, because it isn't associated with any user-entered data (though it may have initial values).
2.  Receive data from a submit request and bind it to the form.
    - Binding data to the form means that the user-entered data and any errors are available when we need to redisplay the form.
3.  Clean and validate the data.
    - Cleaning the data performs sanitization of the input fields, such as removing invalid characters that might be used to send malicious content to the server, and converts them into consistent Python types.
    - Validation checks that the values are appropriate for the field (for example, that they are in the right date range, aren't too short or too long, etc.)
4.  If any data is invalid, re-display the form, this time with any user populated values and error messages for the problem fields.
5.  If all data is valid, perform required actions (such as save the data, send an email, return the result of a search, upload a file, and so on).
6.  Once all actions are complete, redirect the user to another page.

### Django's Form class

The `Form` class is the heart of Django's form handling system. It specifies the fields in the form, their layout, display widgets, labels, initial values, valid values, and (once validated) the error messages associated with invalid fields. The class also provides methods for rendering itself in templates using predefined formats (tables, lists, etc.) or for getting the value of any element (enabling fine-grained manual rendering).

```python
# /project-dir/app-dir/forms.py
from django import forms
class MyForm(forms.Form):
	"""
	Declare fields just like how we did in models
	"""
```

Django provides numerous places where you can validate your data. The easiest way to validate a single field is to override the method `clean_<fieldname>()` for the field you want to check.

The view has to render the default form when it is first called and then either re-render it with error messages if the data is invalid, or process the data and redirect to a new page if the data is valid. In order to perform these different actions, the view has to be able to know whether it is being called for the first time to render the default form, or a subsequent time to validate data.

For forms that use a `POST` request to submit information to the server, the most common pattern is for the view to test against the `POST` request type (`if request.method == 'POST':`) to identify form validation requests and `GET` (using an `else` condition) to identify the initial form creation request. If you want to submit your data using a `GET` request, then a typical approach for identifying whether this is the first or subsequent view invocation is to read the form data (e.g. to read a hidden value in the form).

### ModelForms

### Generic editing views
