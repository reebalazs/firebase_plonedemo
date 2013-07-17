from zope.i18nmessageid import MessageFactory
from Products.CMFCore.permissions import setDefaultRoles

PloneMessageFactory = MessageFactory('plone')

setDefaultRoles('firebaseploneportlets.portlet.Add: Add FireBasePlonePortlets portlet',
                ('Manager', 'Site Administrator', 'Owner', ))
