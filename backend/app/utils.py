def safe_get(data, *keys):
    for key in keys:
        data = data.get(key, {})
    return data or None
