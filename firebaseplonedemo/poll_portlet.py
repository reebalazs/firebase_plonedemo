
from Products.Five.browser.pagetemplatefile import ViewPageTemplateFile

from .portlet import (
    Renderer as RendererBase,
    IFireBasePloneDemoPortlet
)

class Renderer(RendererBase):
    render = ViewPageTemplateFile('templates/poll_portlet.pt')

class IFireBasePollPortlet(IFireBasePloneDemoPortlet):
    pass