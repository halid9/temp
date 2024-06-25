import json
def convert_to_snake_case(name):
    return name.lower().replace('.', '_').replace('&', 'and').replace(' ', '_').replace('-', '_').replace('(', '').replace(')', '').replace('\'', '').replace(',', '').replace('?', '').replace('!', '').replace(':', '').replace(';', '').replace('/', '_').replace('\\', '_').replace('"', '').replace('`', '').replace('~', '').replace('=', '').replace('+', '').replace('*', '').replace('^', '').replace('%', '').replace('$', '').replace('#', '').replace('@', '').replace('!', '').replace('<', '').replace('>', '').replace('|', '').replace('[', '').replace(']', '').replace('{', '').replace('}', '').replace('`', '')

def generate_python_class(data,parent_key = '', class_name='LocaleKeys'):
    python_code = ""

    for key, value in data.items():
        if isinstance(value, dict):
            python_code += generate_python_class(value, parent_key + '.' + key if parent_key else key, class_name)
        else:
            snake_case_key = convert_to_snake_case(parent_key + '_' + key if parent_key else key)
            python_code += f"  static {snake_case_key.upper().replace('_TEXT','')} = '{parent_key + '.' + key if parent_key else key}';\n"
    return python_code

# Load JSON data from file
with open('src/assets/i18n/en.json', 'r') as file:
    json_data = json.load(file)

# Generate TypeScript class
typescript_code = "export class LocaleKeys { \n"
typescript_code += generate_python_class(json_data)
typescript_code += "}"
# Output TypeScript code
print(typescript_code)

# Write TypeScript code to file
with open('src/app/shared/locale_keys.ts', 'w') as file:
    file.write(typescript_code)