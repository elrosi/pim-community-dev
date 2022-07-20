import React, {
  AnchorHTMLAttributes,
  ButtonHTMLAttributes,
  Children,
  cloneElement,
  forwardRef,
  isValidElement,
  ReactNode,
  Ref,
  SyntheticEvent,
} from 'react';
import styled, {css} from 'styled-components';
import {AkeneoThemedProps, getColor, getColorForLevel, getFontSize, Level} from '../../theme';
import {Override} from '../../shared';
import {IconProps} from '../../icons';

type ButtonSize = 'small' | 'default';

type ButtonProps = Override<
  ButtonHTMLAttributes<HTMLButtonElement> & AnchorHTMLAttributes<HTMLAnchorElement>,
  {
    /**
     * Level of the button defining it's color and outline.
     * Possible values are: primary, secondary, tertiary, warning & danger.
     */
    level?: Level;

    /**
     * When an action does not require primary dominance on the page.
     */
    ghost?: boolean;

    /**
     * Used when the user cannot proceed or until an input is collected.
     */
    disabled?: boolean;

    /**
     * Used to display the Button as active.
     */
    active?: boolean;

    /**
     * Define the size of a button.
     */
    size?: ButtonSize;

    /**
     * Function called when the user clicks on the button or hit enter when focused.
     */
    onClick?: (event: SyntheticEvent) => void;

    /**
     * Url to go to if the button is clicked. This allow your button to open in a new tab in case of cmd/ctrl + click
     */
    href?: string;

    /**
     * Accessibility label to describe shortly the button.
     */
    ariaLabel?: string;

    /**
     * Define which element is the label of this button for accessibility purposes. Expect a DOM node id.
     */
    ariaLabelledBy?: string;

    /**
     * Define what element is describing this button for accessibility purposes. Expect a DOM node id.
     */
    ariaDescribedBy?: string;

    /**
     * Children of the button.
     */
    children?: ReactNode;
  }
>;

const getColorStyle = ({
  level,
  ghost,
  disabled,
  active,
}: {level: Level; ghost: boolean; disabled: boolean; active: boolean} & AkeneoThemedProps) => {
  if (ghost) {
    return css`
      color: ${getColorForLevel(level, disabled ? 80 : active ? 140 : 120)};
      background-color: ${getColor('white')};
      border-color: ${getColorForLevel(level, disabled ? 60 : active ? 140 : 100)};

      &:hover:not([disabled]) {
        color: ${getColorForLevel(level, 140)};
        background-color: ${getColorForLevel(level, 20)};
        border-color: ${getColorForLevel(level, 120)};
      }

      &:active:not([disabled]) {
        color: ${getColorForLevel(level, 140)};
        border-color: ${getColorForLevel(level, 140)};
      }
    `;
  }

  return css`
    color: ${getColor('white')};
    background-color: ${getColorForLevel(level, disabled ? 40 : active ? 140 : 100)};
    border-color: ${getColorForLevel(level, disabled ? 40 : active ? 140 : 100)};

    &:hover:not([disabled]) {
      background-color: ${getColorForLevel(level, 120)};
      border-color: ${getColorForLevel(level, 120)};
    }

    &:active:not([disabled]) {
      background-color: ${getColorForLevel(level, 140)};
      border-color: ${getColorForLevel(level, 140)};
    }
  `;
};

const Container = styled.button<
  {
    level: Level;
    ghost: boolean;
    disabled: boolean;
    active: boolean;
    size: ButtonSize;
  } & AkeneoThemedProps
>`
  display: inline-flex;
  align-items: center;
  gap: 10px;
  border-width: 1px;
  font-size: ${getFontSize('default')};
  font-weight: 400;
  text-transform: uppercase;
  border-radius: 16px;
  border-style: solid;
  padding: ${({size}) => (size === 'small' ? '0 10px' : '0 15px')};
  height: ${({size}) => (size === 'small' ? '24px' : '32px')};
  cursor: ${({disabled}) => (disabled ? 'not-allowed' : 'pointer')};
  font-family: inherit;
  transition: background-color 0.1s ease;
  outline-style: none;
  text-decoration: none;
  white-space: nowrap;

  &:focus {
    box-shadow: 0 0 0 2px ${getColor('blue', 40)};
  }

  ${getColorStyle}
`;

/**
 * Buttons express what action will occur when the users clicks.
 * Buttons are used to initialize an action, either in the background or foreground of an experience.
 */
const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      level = 'primary',
      ghost = false,
      disabled = false,
      active = false,
      size = 'default',
      href,
      ariaDescribedBy,
      ariaLabel,
      ariaLabelledBy,
      children,
      onClick,
      type = 'button',
      ...rest
    }: ButtonProps,
    forwardedRef: Ref<HTMLButtonElement>
  ) => {
    const handleAction = (event: SyntheticEvent) => {
      if (disabled || undefined === onClick) return;

      onClick(event);
    };

    return (
      <Container
        as={undefined !== href ? 'a' : 'button'}
        level={level}
        ghost={ghost}
        disabled={disabled}
        active={active}
        size={size}
        aria-describedby={ariaDescribedBy}
        aria-disabled={disabled}
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledBy}
        ref={forwardedRef}
        role="button"
        type={type}
        onClick={handleAction}
        href={disabled ? undefined : href}
        {...rest}
      >
        {Children.map(children, child => {
          if (isValidElement<IconProps>(child)) {
            return cloneElement(child, {size: child.props.size ?? 18});
          }

          return child;
        })}
      </Container>
    );
  }
);

export {Button};
export type {ButtonProps, ButtonSize};
