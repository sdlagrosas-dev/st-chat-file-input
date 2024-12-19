import os
import streamlit.components.v1 as components

_RELEASE = True

if not _RELEASE:
    _component_func = components.declare_component(
        "st_chat_file_input",
        url="http://localhost:3001",
    )
else:
    parent_dir = os.path.dirname(os.path.abspath(__file__))
    build_dir = os.path.join(parent_dir, "frontend/build")
    _component_func = components.declare_component("st_chat_file_input", path=build_dir)

def st_chat_file_input(placeholder="Type your message here", key=None, disabled=False, file_formats=None):
    """Create a new instance of "st_chat_file_input".

    Parameters
    ----------
    placeholder: str
        The placeholder of the user to whom the message is addressed.
    key: str or None
        An optional key that uniquely identifies this component. If this is
        None, and the component's arguments are changed, the component will
        be re-mounted in the Streamlit frontend and lose its current state.

    Returns
    -------
    dict
        A dictionary with the message and file data.
    """
    # Set default values for message and files_data
    default_value = {"message": "", "files_data": []}

    # Declare the component with default values
    component_value = _component_func(
        placeholder=placeholder,
        key=key,
        disabled=disabled,
        file_formats=file_formats,
        default=default_value
    )

    return component_value
