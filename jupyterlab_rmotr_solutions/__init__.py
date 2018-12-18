import json
from notebook.base.handlers import IPythonHandler
from notebook.utils import url_path_join


__version__ = '0.0.1'

class RmotrSolutionsHandler(IPythonHandler):
    def initialize(self,
                   is_enabled=None,
                   is_student=None,
                   is_teacher=None):
        self.is_enabled = is_enabled
        self.is_student = is_student
        self.is_teacher = is_teacher

    def get(self):
        res_dict = {
            'is_enabled': self.is_enabled or False,
            'is_student': self.is_student or False,
            'is_teacher': self.is_teacher or False,
        }

        self.finish(json.dumps(res_dict))


def load_jupyter_server_extension(nb_server_app):
    """
    Called when the extension is loaded.
    Args:
        nb_server_app (NotebookWebApplication): handle to the Notebook webserver instance.
    """
    web_app = nb_server_app.web_app
    rmotr_solutions_config = nb_server_app.config.get('JupyterLabRmotrSolutions', {})
    is_enabled = rmotr_solutions_config.get('is_enabled', [])
    is_student = rmotr_solutions_config.get('is_student', [])
    is_teacher = rmotr_solutions_config.get('is_teacher', [])

    host_pattern = '.*$'
    base_url = web_app.settings['base_url']
    path = url_path_join(base_url, 'rmotr-solutions')
    print('>>> Installing jupyterlab_rmotr_solutions handler on path %s' % path)

    config_dict = {
        'is_enabled': is_enabled,
        'is_student': is_student,
        'is_teacher': is_teacher
    }

    web_app.add_handlers(host_pattern, [(path, RmotrSolutionsHandler, config_dict)])

def _jupyter_labextension_paths():
    return [{
        "module": "jupyterlab_rmotr_solutions"
    }]
