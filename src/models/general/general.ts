export const PermissionSchema = {
  key: { type: String, required: true },
  value: { type: Number, required: true },
};

export const VisibleLinkSchema = {
  url: { type: String, required: true },
  label: { type: String, required: true },
};
