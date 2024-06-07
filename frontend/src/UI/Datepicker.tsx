import { today } from '../constants';

type dateType = {
  value: any;
  setValue: any;
};

const Datepicker = ({ value, setValue }: dateType) => {
  return (
    <input
      className="date"
      type="date"
      value={value}
      onChange={(e) => setValue(e.target.value)}
      max={today}
    />
  );
};

export default Datepicker;
