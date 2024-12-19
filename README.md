# Streamlit Chat Input Component

A minimal Streamlit chat input component that allows you to upload files

## Building the Component

To build the component, go to the `st_chat_file_input/frontend` directory and run the following command:

```sh
npm run build
```

## Building the Package

To build the package, go to the root directory and run the following command:

```sh
python setup.py sdist bdist_wheel
```

## Installation

To install the package, locate the .whl file in the `dist` directory and run the following command:

```sh
pip install st_chat_file_input.whl
```

## Usage

Here's a basic example of how to use the `st_chat_file_input` component:

```python
import streamlit as st
from st_chat_file_input import st_chat_file_input

# Use the chat file input component
chat_input = st_chat_file_input()

# Display the message (str)
st.write(chat_input['message'])

# Display the uploaded files (list)
st.write(chat_input['files'])
```
