variable "environment" {
  type        = string
  default     = "test"
  description = "The environment to deploy to"
}

variable "postgres" {
  type = object({
    sku_name   = string
    storage_mb = number
  })
}

variable "function" {
  type = object({
    sku_name = string
    always_on = bool
  })
}

