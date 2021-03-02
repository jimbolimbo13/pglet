import React from 'react';
import { WebSocketContext } from '../WebSocket';
import { useDispatch } from 'react-redux'
import { changeProps } from '../slices/pageSlice'
import { Toggle, IToggleProps } from '@fluentui/react';
import { IControlProps } from './Control.types'
import { defaultPixels, getId } from './Utils'

export const MyToggle = React.memo<IControlProps>(({control, parentDisabled}) => {

  const ws = React.useContext(WebSocketContext);
  const dispatch = useDispatch();

  let disabled = (control.disabled === 'true') || parentDisabled;

  const handleChange = (event?: React.FormEvent<HTMLElement | HTMLInputElement>, checked?: boolean) => {

    if (checked !== undefined) {

      const val = checked.toString();

      let payload: any = {}
      if (control.f) {
        // binding redirect
        const p = control.f.split('|')
        payload["i"] = p[0]
        payload[p[1]] = val
      } else {
        // unbound control
        payload["i"] = control.i
        payload["value"] = val
      }
  
      dispatch(changeProps([payload]));
      ws.updateControlProps([payload]);
      ws.pageEventFromWeb(control.i, 'change', control.data ? `${control.data}|${val}` : val)
    }
  }

  const toggleProps: IToggleProps = {
    id: getId(control.i),
    checked: control.value === "true",
    inlineLabel: control.inline === "true",
    label: control.label ? control.label : undefined,
    onText: control.ontext ? control.ontext : undefined,
    offText: control.offtext ? control.offtext : undefined,
    disabled: disabled,
    styles: {
      root: {
        width: control.width !== undefined ? defaultPixels(control.width) : undefined,
        height: control.height !== undefined ? defaultPixels(control.height) : undefined,
        padding: control.padding !== undefined ? defaultPixels(control.padding) : undefined,
        margin: control.margin !== undefined ? defaultPixels(control.margin) : undefined   
      }
    }
  };

  return <Toggle {...toggleProps} onChange={handleChange} />;
})