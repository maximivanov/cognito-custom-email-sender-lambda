variable sendgrid_api_key {
  type = string
  sensitive = true
}

variable project {
    type = string
}

variable region {
    type = string
    default = "us-east-1"
}

variable update_user_pool_config_file {
    type = string
}