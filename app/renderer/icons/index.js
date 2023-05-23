import cn from 'classnames'
import React from 'react'

const Icon = ({ className, border, fixedWidth, large, pulse, size3x, ...props }) => {
  return <i
    className={cn(
      'fa',
      className,
      pulse && 'fa-pulse',
      large && 'fa-lg',
      fixedWidth && 'fa-fw',
      size3x && 'fa-3x',
      border && 'fa-border'
    )}
    {...props}
  />
}

export const Anchor = ({ className, ...props }) => {
  return <Icon className={cn('fa-anchor', className)} {...props} />
}

export const Angle = ({ className, down, left, right, up, ...props }) => {
  return <Icon
    className={cn(
      down && 'fa-angle-down',
      left && 'fa-angle-left',
      right && 'fa-angle-right',
      up && 'fa-angle-up',
      !down && !left && !right && !up && 'fa-angle-right', // default
      className
    )}
    {...props}
  />
}

export const Bars = ({ className, ...props }) => {
  return <Icon className={cn('fa-bars', className)} {...props} />
}

export const Ban = ({ className, ...props }) => {
  return <Icon className={cn('fa-ban', className)} {...props} />
}

export const Chevron = ({ className, down, left, right, up, ...props }) => {
  return <Icon
    className={cn(
      down && 'fa-chevron-down',
      left && 'fa-chevron-left',
      right && 'fa-chevron-right',
      up && 'fa-chevron-up',
      !down && !left && !right && !up && 'fa-chevron-right', // default
      className
    )}
    {...props}
  />
}

export const Database = ({ className, ...props }) => {
  return <Icon className={cn('fa-database', className)} {...props} />
}

export const Close = ({ className, ...props }) => {
  return <Icon className={cn('fa-close', className)} {...props} />
}

export const Edit = ({ className, ...props }) => {
  return <Icon className={cn('fa-pencil', className)} {...props} />
}

export const FileIcon = ({ className, video, ...props }) => {
  return <Icon
    className={cn(
      video && 'fa-file-video-o',
      !video && 'fa-file', // default
      className
    )}
    {...props}
  />
}

export const ImportIcon = ({ className, ...props }) => {
  return <Icon
    className={cn(
      'fa-download',
      className
    )}
    {...props}
  />
}

export const Info = ({ className, circle, ...props }) => {
  return <Icon
    className={cn(
      circle && 'fa-info-circle',
      !circle && 'fa-info',
      className
    )}
    {...props}
  />
}

export const Play = ({ className, ...props }) => {
  return <Icon className={cn('fa-play', className)} {...props} />
}

export const Search = ({ className, ...props }) => {
  return <Icon className={cn('fa-search', className)} {...props} />
}

export const Spinner = ({ className, ...props }) => {
  return <Icon className={cn('fa-spinner', className)} {...props} />
}

export const Star = ({ className, half, outline, ...props }) => {
  return <Icon
    className={cn(
      half && 'fa-star-half-o',
      outline && 'fa-star-o',
      !half && !outline && 'fa-star', // default
      className
    )}
    {...props}
  />
}

export const Trash = ({ className, ...props }) => {
  return <Icon className={cn('fa-trash', className)} {...props} />
}
