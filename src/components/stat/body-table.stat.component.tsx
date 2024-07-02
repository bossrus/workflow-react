import * as React from 'react';
import { useEffect } from 'react';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Checkbox from '@mui/material/Checkbox';
import { visuallyHidden } from '@mui/utils';
import { IWorkflow } from '@/interfaces/workflow.interface.ts';
import { useReduxSelectors } from '@/_hooks/useReduxSelectors.hook.ts';
import { IOrder } from '@/interfaces/databases.interface.ts';
import ContainedSmallButtonComponent from '@/components/_shared/contained.smallButton.component.tsx';

interface IBodyTableProps {
	rows: IWorkflow[];
	showSpecificWorkflows: (id: string) => void;
	setSortByField: (field: keyof IWorkflow) => void,
	setSortDirection: (field: IOrder) => void,
	sortByField: keyof IWorkflow,
	sortDirection: IOrder,
	checkSelected: (selectedList: string[]) => void;
}

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
	if (b && orderBy && b[orderBy] && a[orderBy]) {
		if (b[orderBy] === undefined || a[orderBy] === undefined) {
			return 0;
		}

		if (b[orderBy] < a[orderBy]) {
			return -1;
		}
		if (b[orderBy] > a[orderBy]) {
			return 1;
		}
	}
	return 0;
}

function getComparator<Key extends keyof IWorkflow>(
	order: IOrder,
	orderBy: Key,
): (a: IWorkflow, b: IWorkflow) => number {
	return order === 'desc'
		? (a, b) => descendingComparator(a, b, orderBy)
		: (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort<T>(array: T[], comparator: (a: T, b: T) => number): T[] {
	const stabilizedThis = array.map((el, index) => [el, index] as [T, number]);
	stabilizedThis.sort((a, b) => {
		const order = comparator(a[0], b[0]);
		if (order !== 0) return order;
		return a[1] - b[1];
	});
	return stabilizedThis.map((el) => el[0]);
}

interface HeadCell {
	id: keyof IWorkflow;
	label: string;
}

const headCells: readonly HeadCell[] = [
	{
		id: 'firm',
		label: 'Журнал',
	},
	{
		id: 'modification',
		label: '№',
	},
	{
		id: 'title',
		label: 'Название',
	},
	{
		id: 'countPages',
		label: 'Полос',
	},
	{
		id: 'isPublished',
		label: 'Дата',
	},
	{
		id: 'whoAddThisWorkflow',
		label: 'Создатель',
	},
	{
		id: 'type',
		label: 'Описание',
	},
];


interface EnhancedTableProps {
	numSelected: number;
	onRequestSort: (event: React.MouseEvent<unknown>, property: keyof IWorkflow) => void;
	onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
	order: IOrder;
	orderBy: keyof IWorkflow;
	rowCount: number;

}

function EnhancedTableHead(props: EnhancedTableProps) {
	const { onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort } =
		props;
	const createSortHandler =
		(property: keyof IWorkflow) => (event: React.MouseEvent<unknown>) => {
			onRequestSort(event, property);
		};

	return (
		<TableHead>
			<TableRow>
				<TableCell padding="checkbox">
					<Checkbox
						color="primary"
						indeterminate={numSelected > 0 && numSelected < rowCount}
						checked={rowCount > 0 && numSelected === rowCount}
						onChange={onSelectAllClick}
						inputProps={{
							'aria-label': 'select all desserts',
						}}
					/>
				</TableCell>
				{headCells.map((headCell) => (
					<TableCell
						key={(headCell.id).toString()}
						align={'left'}
						sortDirection={orderBy === headCell.id ? order : false}
						sx={{
							padding: '0 0 0 10px !important',
							paddingLeft: '10px',
							paddingRight: 'none',
							width: 'auto',
							marginRight: '0 !important',
						}}
					>
						<TableSortLabel
							active={orderBy === headCell.id}
							direction={orderBy === headCell.id ? order : 'asc'}
							onClick={createSortHandler(headCell.id)}
						>
							{headCell.label}
							{orderBy === headCell.id ? (
								<Box component="span"
									 sx={{ ...visuallyHidden }}>
									{order === 'desc' ? 'sorted descending' : 'sorted ascending'}
								</Box>
							) : null}
						</TableSortLabel>
					</TableCell>
				))}
			</TableRow>
		</TableHead>
	);
}

export default function BodyTableStatComponent({
												   rows,
												   showSpecificWorkflows,
												   sortByField,
												   setSortByField,
												   sortDirection,
												   setSortDirection,
												   checkSelected,
											   }: IBodyTableProps) {
	const [selected, setSelected] = React.useState<readonly string[]>([]);

	const { usersObject, modificationsObject, firmsObject, typesOfWorkObject } = useReduxSelectors();

	const handleRequestSort = (
		_event: React.MouseEvent<unknown>,
		property: keyof IWorkflow | string | number | symbol,
	) => {
		const isAsc = sortByField === property && sortDirection === 'asc';
		setSortDirection(isAsc ? 'desc' : 'asc');
		setSortByField(property as keyof IWorkflow);
	};

	useEffect(() => {
		setSelected([]);
	}, [rows]);

	const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
		if (event.target.checked) {
			const newSelected = rows.filter(row => !row.isCheckedOnStat).map(row => row._id as string);
			console.log('newSelected = ', newSelected);
			setSelected(newSelected);
			return;
		}
		setSelected([]);
	};

	const handleClick = (_event: React.MouseEvent<unknown>, id: string) => {
		const selectedIndex = selected.indexOf(id);
		let newSelected: readonly string[] = [];

		if (selectedIndex === -1) {
			newSelected = newSelected.concat(selected, id);
		} else if (selectedIndex === 0) {
			newSelected = newSelected.concat(selected.slice(1));
		} else if (selectedIndex === selected.length - 1) {
			newSelected = newSelected.concat(selected.slice(0, -1));
		} else if (selectedIndex > 0) {
			newSelected = newSelected.concat(
				selected.slice(0, selectedIndex),
				selected.slice(selectedIndex + 1),
			);
		}
		setSelected(newSelected);
	};

	const isSelected = (_id: string) => selected.indexOf(_id) !== -1;

	const visibleRows = React.useMemo(
		() =>
			stableSort(rows, getComparator(sortDirection, sortByField as keyof IWorkflow)),
		[sortDirection, sortByField, rows],
	);

	function sendCheckedInfo() {
		checkSelected([...selected]);
		setSelected([]);
	}

	return (
		<Box
			className={'width-100 height-100'}
		>
			{
				(visibleRows.length > 0 &&
					Object.keys(firmsObject).length > 0 &&
					Object.keys(usersObject).length > 0 &&
					Object.keys(modificationsObject).length > 0 &&
					Object.keys(typesOfWorkObject).length > 0)
					? <TableContainer>
						<Table
							aria-labelledby="tableTitle"
							className={'table-container max-height-100'}
							// border={1}
						>
							<EnhancedTableHead
								numSelected={selected.length}
								order={sortDirection}
								orderBy={sortByField}
								onSelectAllClick={handleSelectAllClick}
								onRequestSort={handleRequestSort}
								rowCount={rows.length}
							/>
							<TableBody>
								{visibleRows.map((row, index) => {
									const isItemSelected = isSelected(row._id as string);
									const labelId = `enhanced-table-checkbox-${index}`;

									return (
										<TableRow
											hover
											role="checkbox"
											aria-checked={isItemSelected}
											tabIndex={-1}
											key={row._id}
											selected={isItemSelected}
											className={'cursor-pointer'}
										>
											<TableCell padding="checkbox">

												{!row.isCheckedOnStat
													? <Checkbox
														color="primary"
														checked={isItemSelected}
														inputProps={{
															'aria-labelledby': labelId,
														}}
														onClick={(event) => handleClick(event, row._id as string)}
													/>
													: <>
														{new Date(row.isPublished!).toLocaleString('ru-RU', {
															day: '2-digit',
															month: '2-digit',
															year: '2-digit',
															hour: '2-digit',
															minute: '2-digit',
														})}
													</>
												}
											</TableCell>
											<TableCell
												className={'text-align-left padding-0-0-0-10px'}
											>
												{firmsObject[row.firm].title}
											</TableCell>
											<TableCell
												className={'text-align-left padding-0-0-0-10px'}
											>
												{modificationsObject[row.modification].title}
											</TableCell>
											<TableCell
												className={'text-align-left padding-0-0-0-10px'}
											>
											<span className={'fake-link'}
												  onClick={() => showSpecificWorkflows(row.mainId as string)}>
												{row.title}
											</span>
											</TableCell>
											<TableCell
												className={'text-align-left padding-0-0-0-10px'}
											>
												{row.countPages}
											</TableCell>
											<TableCell
												className={'text-align-left padding-0-0-0-10px'}
											>
												{new Date(row.isPublished as number).toLocaleString('ru-RU', {
													day: '2-digit',
													month: '2-digit',
													year: 'numeric',
													hour: '2-digit',
													minute: '2-digit',
												})}
											</TableCell>
											<TableCell
												className={'text-align-left padding-0-0-0-10px'}
											>
												{usersObject[row.whoAddThisWorkflow].name}
											</TableCell>
											<TableCell
												className={'text-align-left padding-0-0-0-10px'}
											>
												{typesOfWorkObject[row.type].title}
											</TableCell>
										</TableRow>
									);
								})}
							</TableBody>
						</Table>
						<Box px={2} pb={2}>
							<ContainedSmallButtonComponent
								disabled={selected.length === 0}
								className={'width-100'}
								color={'info'}
								onClick={() => sendCheckedInfo()}
							>
								Отметить выделенное
							</ContainedSmallButtonComponent>
						</Box>
					</TableContainer>
					: <Box
						className={'height-100 width-100 display-flex align-items-center text-bold justify-content-center'}
					>
						По данным фильтрам ничего не найдено
					</Box>
			}
		</Box>
	);
}
