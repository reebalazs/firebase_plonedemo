import re
import logging
import random
from firebase_token_generator import create_token

from zope import schema
from zope.interface import implements
from zope.component import getUtility
from zope.formlib import form
from zope.component import getMultiAdapter
from Products.Five.browser.pagetemplatefile import ViewPageTemplateFile
from plone.i18n.normalizer.interfaces import IIDNormalizer
from plone.portlets.interfaces import IPortletDataProvider
# from plone.app.form.widgets.wysiwygwidget import WYSIWYGWidget
from plone.app.portlets.portlets import base
from plone.portlet.static import PloneMessageFactory as _

logger = logging.getLogger('firebaseploneportlets')


class IFireBasePollPortlet(IPortletDataProvider):
    """A portlet which renders predefined static HTML.

    It inherits from IPortletDataProvider because for this portlet, the
    data that is being rendered and the portlet assignment itself are the
    same.
    """

    header = schema.TextLine(
        title=_(u"Portlet header"),
        description=_(u"Title of the rendered portlet"),
        constraint=re.compile("[^\s]").match,
        required=False)

    firebase_url = schema.TextLine(
        title=_(u"FireBase url"),
        description=_(u"The service url for your FireBase connection"),
        constraint=re.compile("[^\s]").match,
        required=True)

    firebase_secret = schema.TextLine(
        title=_(u"FireBase secret"),
        description=_(u"The secret used to authenticate to your FireBase"),
        constraint=re.compile("[^\s]").match,
        required=False)


class Assignment(base.Assignment):
    """Portlet assignment.

    This is what is actually managed through the portlets UI and associated
    with columns.
    """

    implements(IFireBasePollPortlet)

    header = _(u"title_firebase_poll_portlet", default=u"FireBase poll portlet")
    firebase_url = u''
    firebase_secret = u''

    def __init__(self, header=u'', firebase_url=u'', firebase_secret=u''):
        self.header = header
        self.firebase_url = firebase_url
        self.firebase_secret = firebase_secret

    @property
    def title(self):
        """This property is used to give the title of the portlet in the
        "manage portlets" screen. Here, we use the title that the user gave or
        static string if title not defined.
        """
        return self.header or _(u'portlet_firebase_poll', default=u"FireBase poll Portlet")


class Renderer(base.Renderer):
    """Portlet renderer.

    This is registered in configure.zcml. The referenced page template is
    rendered, and the implicit variable 'view' will refer to an instance
    of this class. Other methods can be added and referenced in the template.
    """
    render = ViewPageTemplateFile('templates/poll_portlet.pt')

    def css_class(self):
        """Generate a CSS class from the portlet header
        """
        header = self.data.header
        if header:
            normalizer = getUtility(IIDNormalizer)
            return "portlet-firebase-poll-%s" % normalizer.normalize(header)
        return "portlet-firebase-poll"

    @property
    def unique_id(self):
        """Generate a unique id within the request
        """
        next_id = self.request.firebase_plonedemo_next_id = \
            getattr(self.request, 'firebase_plonedemo_next_id', 0)
        unique_id = "portlet-firebase-poll-id-%04i" % (next_id, )
        self.request.firebase_plonedemo_next_id += 1
        return unique_id

    def extend_data(self, data):
        pass

    @property
    def auth_data(self):
        portal_state = getMultiAdapter((self.context, self.request),
            name="plone_portal_state")
        plone_userid = portal_state.member().getId()
        custom_data = {
            'ploneUserid': plone_userid,
        }
        self.extend_data(custom_data)
        return custom_data

    @property
    def auth_token(self):
        custom_data = self.auth_data
        admin = False
        options = {'admin': admin}
        token = create_token(self.data.firebase_secret, custom_data, options)
        return token


class AddForm(base.AddForm):
    """Portlet add form.

    This is registered in configure.zcml. The form_fields variable tells
    zope.formlib which fields to display. The create() method actually
    constructs the assignment that is being added.
    """
    form_fields = form.Fields(IFireBasePollPortlet)
    ##form_fields['text'].custom_widget = WYSIWYGWidget
    label = _(u"title_add_firebase_poll_portlet", default=u"Add FireBase poll portlet")
    description = _(u"description_firebase_poll_portlet",
                    default=u"A poll portlet to show FireBase in Plone, a Demo.")

    def create(self, data):
        return Assignment(**data)


class EditForm(base.EditForm):
    """Portlet edit form.

    This is registered with configure.zcml. The form_fields variable tells
    zope.formlib which fields to display.
    """
    form_fields = form.Fields(IFireBasePollPortlet)
    #form_fields['text'].custom_widget = WYSIWYGWidget
    label = _(u"title_edit_firebase_poll_portlet", default=u"Edit FireBase poll portlet")
    description = _(u"description_firebase_poll_portlet",
                    default=u"A poll portlet to show FireBase in Plone, a Demo.")
