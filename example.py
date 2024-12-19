import streamlit as st
from st_chat_file_input import st_chat_file_input
import time
import base64

if "CONVERSATION" not in st.session_state:
    st.session_state["CONVERSATION"] = []

if "CHAT_INPUT_KEY" not in st.session_state:
    st.session_state["CHAT_INPUT_KEY"] = int(time.time())

if "CHAT_INPUT_VALUE" not in st.session_state:
    st.session_state["CHAT_INPUT_VALUE"] = None

st.subheader("Chat Component with File Upload")

st.markdown("""
    <style>
        iframe[title='st_chat_file_input.st_chat_file_input'] {
            position: fixed;
            bottom: 10px;
            z-index: 1000;
            }
    </style>
""", unsafe_allow_html=True)

for message in st.session_state["CONVERSATION"]:
    with st.chat_message(name=message['role']):
        st.write(message['content'])

        if message.get('files'):
            for file in message['files']:
                st.image(file['data'], caption=file['name'])


accepted_formats = ["jpg", "png"]
disabled_checkbox = st.checkbox("Disable input")

# Use a unique key for the component
component_key = f"chat_input_{st.session_state['CHAT_INPUT_KEY']}"
result = st_chat_file_input(key=component_key, disabled=disabled_checkbox, file_formats=accepted_formats)

# Update session state if we get a new result
if result:

    if result['message'].strip() != "" or result['files_data']:
        st.session_state["CHAT_INPUT_VALUE"] = result

        text_content = ""
        if st.session_state["CHAT_INPUT_VALUE"]['message'].strip() != "":
            text_content = st.session_state["CHAT_INPUT_VALUE"]['message'].strip()

        files_content = []
        if st.session_state["CHAT_INPUT_VALUE"]['files_data']:
            for file in st.session_state["CHAT_INPUT_VALUE"]['files_data']:
                file_data = file['data'].split(",")[1]  # Remove data URL prefix
                st.write("file['data']:", file['data'][:50])
                file_bytes = base64.b64decode(file_data)
                files_content.append({"name": file['name'], "data": file_bytes})
        st.session_state["CONVERSATION"].append({"role": "user", "content": text_content, "files": files_content})
        
        st.session_state['CHAT_INPUT_KEY'] = int(time.time())
        st.rerun()
