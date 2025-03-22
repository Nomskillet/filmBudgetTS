import type { RootState } from '../store/store';
import { useSelector, useDispatch } from 'react-redux';
import { decrement, increment } from '../store/counterSlice';

function HomePage() {
  const count = useSelector((state: RootState) => state.counter.value);
  const dispatch = useDispatch();
  return (
    <div>
      <h1>Welcome to Film Budget Tracker</h1>
      <p>Track and manage your budgets easily.</p>

      <div>
        <div>
          <button
            aria-label="Increment value"
            onClick={() => dispatch(increment())}
          >
            Increment
          </button>
          <span>{count}</span>
          <button
            aria-label="Decrement value"
            onClick={() => dispatch(decrement())}
          >
            Decrement
          </button>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
